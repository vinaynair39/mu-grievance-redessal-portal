import React from "react";
import { Line } from "react-chartjs-2";

const LineChart = ({ dataSet }) => {
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;
  const params = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: currentYear,
        fill: false,
        data: Object.values(dataSet.currentYearStats),
        lineTension: 0.1,
        borderColor: "#3BB2AC",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "#3BB2AC",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#3BB2AC",
        pointHoverBorderColor: "#3BB2AC",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
      },
    ],
  };

  if (!Object.values(dataSet.previousYearStats).every((data) => data === 0)) {
    params.datasets.push({
      label: previousYear,
      fill: false,
      data: Object.values(dataSet.previousYearStats),
      lineTension: 0.1,
      borderColor: "#2F8ECF",
      borderCapStyle: "butt",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      pointBorderColor: "#2F8ECF",
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "#2F8ECF",
      pointHoverBorderColor: "#2F8ECF",
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
    });
  }

  return (
    <>
      <Line
        data={params}
        options={{
          title: {
            display: true,
            text: "Monthly Report Of Grievances Posted",
            fontSize: 15,
          },
        }}
      />
    </>
  );
};
export default LineChart;
