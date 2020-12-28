const dayjs = require("dayjs");
var localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);

console.log(dayjs("2020-12-30T14:00:45+05:30").format("LLL"));
