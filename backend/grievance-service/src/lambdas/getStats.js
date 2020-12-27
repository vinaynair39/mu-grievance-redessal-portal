import commonMiddleware from "../lib/commonMiddleware";
import AWS from "aws-sdk";
import createHttpError from "http-errors";
import moment from "moment";
const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getStats(event, context) {
  let grievances;
  const params = {
    TableName: process.env.GRIEVANCE_TABLE_NAME,
    ProjectionExpression: "#status, #date",
    ExpressionAttributeNames: {
      "#status": "status",
      "#date": "createdAt",
    },
  };
  try {
    const result = await dynamodb.scan(params).promise();
    grievances = result.Items;
  } catch (error) {
    console.error(error);
    throw new createHttpError.InternalServerError(error);
  }

  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  const currentYearStats = {
    Jan: 0,
    Feb: 0,
    Mar: 0,
    Apr: 0,
    May: 0,
    Jun: 0,
    Jul: 0,
    Aug: 0,
    Sep: 0,
    Oct: 0,
    Nov: 0,
    Dec: 0,
  };

  const previousYearStats = {
    Jan: 0,
    Feb: 0,
    Mar: 0,
    Apr: 0,
    May: 0,
    Jun: 0,
    Jul: 0,
    Aug: 0,
    Sep: 0,
    Oct: 0,
    Nov: 0,
    Dec: 0,
  };

  const stats = {
    REJECTED: 0,
    PENDING: 0,
    NEW: 0,
    SELECTED: 0,
    UNDER_PROCESS: 0,
    SOLVED: 0,
    TOTAL: grievances.length,
  };

  grievances.forEach((grievance) => {
    const [month, year] = moment(grievances.createdAt).format("MMM YYYY").split(" ");
    console.log("data", month, year);
    stats[grievance.status] += 1;
    if (year == currentYear) currentYearStats[month] += 1;
    else if (year == previousYear) previousYearStats[month] += 1;
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      stats,
      currentYearStats,
      previousYearStats,
    }),
  };
}

export const handler = commonMiddleware(getStats);
