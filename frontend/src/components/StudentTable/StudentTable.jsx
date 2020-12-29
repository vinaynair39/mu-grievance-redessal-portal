import React from "react";
import { Table, Tag, Button, Modal, Popconfirm } from "antd";
import { DateTime } from "luxon";
import { Link, useHistory } from "react-router-dom";
import useWindowSize from "utils/useWindowSize";
import "./StudentTable.scss";

const StudentTable = ({ studentGrievances }) => {
  const history = useHistory();
  const { width } = useWindowSize();
  const studcolumn = [
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      align: "center",
      render: (subject) => (
        <Link style={{ color: "#404a52", fontWeight: "bold" }} to={`/student/status/${subject.id}`}>
          {subject.title}
        </Link>
      ),
    },
    {
      title: "Date of Application",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (date) => DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_MED),
    },
    {
      title: "Against",
      dataIndex: "against",
      key: "against",
      align: "center",
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        let color = "";
        if (status === "UNDER_PROCESS") {
          color = "blue";
        } else if (status === "REJECTED") {
          color = "#e5435a";
        } else if (status === "NEW") {
          color = "geekblue";
        } else if (status === "SELECTED") {
          color = "blue";
        } else if (status === "SOLVED") {
          color = "#3BB2AC";
        } else {
          color = "geekblue";
        }
        return (
          <div className="StudentTable__tag">
            <Tag color={color} key={status}>
              {status}
            </Tag>
          </div>
        );
      },
    },
    {
      title: "Meeting Date & Time",
      dataIndex: "allotedDate",
      key: "allotedDate",
      align: "center",
      render: (date) => (!!date ? DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_MED) : "Not fixed yet"),
    },
    // {
    //   title: "Messages",
    //   dataIndex: "messages",
    //   key: "messages",
    //   align: "center",
    //   render: (date) => (!!date ? DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_MED) : "Not fixed yet"),
    // },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: ({ status, id, meetingJoin, actionTakenReport, meetingType }) => {
        if (status === "NEW") {
          return (
            <Link style={{ color: "#3f5366", cursor: "pointer" }} to={`/student/edit/${id}`}>
              <Button>Edit</Button>
            </Link>
          );
        } else if (status === "UNDER_PROCESS") {
          if (meetingType === "VIRTUAL")
            return (
              <Button style={{ backgroundColor: "#2F8ECF", color: "white" }}>
                <a type="primary" href={meetingJoin} target="_blank">
                  Join Meeting
                </a>
              </Button>
            );
        } else if (status === "REJECTED") {
          return (
            <Popconfirm
              title="Read the reason of rejection(sent to your mail) carefully before re-applying."
              okText="Proceed"
              onConfirm={() => history.push(`/student/edit/${id}`)}
              cancelText="Canel"
              on
            >
              <Button style={{ backgroundColor: "#2F8ECF", color: "white" }}>Re-apply</Button>
            </Popconfirm>
          );
        } else if (status === "SOLVED") {
          return (
            <Button
              onClick={() =>
                Modal.info({
                  title: actionTakenReport.subject,
                  content: actionTakenReport.body,
                })
              }
            >
              Action Taken Report
            </Button>
          );
        }
      },
    },
  ];

  const dataSource = studentGrievances.map((ele, index) => ({
    key: ele.id,
    status: ele.status,
    createdAt: ele.createdAt,
    action: {
      status: ele.status,
      id: ele.id,
      meetingJoin: ele.meetingJoinLink,
      actionTakenReport: ele.actionTakenReport,
      meetingType: ele.meetingType,
    },
    against: ele.complaintAgainst,
    srNo: index + 1,
    meeting: ele.meetingJoinLink,
    meetingType: ele.meetingType,
    subject: {
      title: ele.title,
      id: ele.id,
    },
    allotedDate: ele.allotedAt,
  }));

  return (
    <div className="StudentTable__edit">
      <Table
        dataSource={dataSource}
        columns={studcolumn}
        scroll={{ x: width < 450 ? true : null }}
        size={width < 800 ? "small" : "medium"}
        pagination={{ position: ["bottomLeft"], defaultPageSize: 4 }}
      />
    </div>
  );
};

export default StudentTable;
