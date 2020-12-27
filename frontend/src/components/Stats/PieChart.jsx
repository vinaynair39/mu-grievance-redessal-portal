import React, { Component } from "react";
import { Pie } from "react-chartjs-2";

class PieChart extends Component {
  state = {
    options: {
      responsive: true,
      maintainAspectRatio: true,
      title: {
        display: true,
        text: "Current Statistics",
        fontSize: 15,
      },
      legend: {
        responsive: true,
        display: true,
        position: "bottom",
        align: "center",
      },
    },
  };

  render() {
    const { dataSet } = this.props;
    const data = {
      datasets: [
        {
          data: [dataSet.UNDER_PROCESS + dataSet.NEW + dataSet.SELECTED, dataSet.SOLVED, dataSet.REJECTED],
          backgroundColor: ["#2F8ECF", "#3BB2AC", "#e5445b"],
          hoverBackgroundColor: ["#2F8ECF", "#3BB2AC", "#e5445b"],
        },
      ],
      labels: ["Pending", "Solved", "Rejected"],
    };
    return <Pie data={data} options={this.state.options} />;
  }
}
export default PieChart;
