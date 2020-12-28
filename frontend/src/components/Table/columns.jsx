import { Link } from "react-router-dom";
import { DateTime } from "luxon";
import { Space, Button, Dropdown, Badge, Menu, Popconfirm, Modal } from "antd";

import { replyFromPrincipalModal } from "components/CustomModals/ModalInput";

const menu = ({ documents, comments, showMessage, setShowMessage, setShowDocumentsModal, setCurrentDocument }) => {
  return (
    <Menu>
      <Menu.Item>
        <Button
          style={{ border: "none" }}
          onClick={() => {
            setShowMessage(true);
          }}
        >
          Message
        </Button>
        {replyFromPrincipalModal(comments, showMessage, setShowMessage)}
      </Menu.Item>
      <Menu.Item>
        <Button
          style={{ border: "none" }}
          onClick={() => {
            setShowDocumentsModal(true);
            setCurrentDocument(documents);
          }}
        >
          Documents
        </Button>
      </Menu.Item>
    </Menu>
  );
};

export const underProcessGrievanceColumn = ({
  userType,
  setCurrentGrievanceId,
  setCurrentGrievanceCollegeName,
  setInviteVisible,
  setShowResolutionFormModal,
}) => {
  return [
    {
      title: "Subject",
      dataIndex: "title",
      key: "subject",
      render: (title) => (
        <Link style={{ color: "#5a6270" }} to={userType === "SECRETARY" ? `/secretary/grievance/${title.id}` : `/committee/grievance/${title.id}`}>
          {title.title}
        </Link>
      ),
    },
    {
      title: "Against",
      dataIndex: "complaintAgainst",
      key: "against",
      render: (text) => <span style={{ fontWeight: "bold" }}>{text}</span>,
    },

    {
      title: "Meeting Type",
      key: "meetingType",
      dataIndex: "meetingType",
      render: (text) => <span style={{ backgroundColor: "#ffc765", color: "white", padding: "0.2rem 0.3rem", borderRadius: "2px" }}>{text}</span>,
    },
    {
      title: "Invite officals for Meeting",
      key: "invite",
      align: "invite",
      dataIndex: "resolution",
      render: ({ id, invited, collegeName }) => (
        <Space size="middle">
          <Button
            type="primary"
            disabled={invited || userType === "COMMITTEE"}
            onClick={() => {
              setCurrentGrievanceId(id);
              setCurrentGrievanceCollegeName(collegeName);
              setInviteVisible(true);
            }}
          >
            {invited ? "Invited" : "Invite"}
          </Button>
        </Space>
      ),
    },
    {
      title: "Date & Time",
      key: "date",
      dataIndex: "allotedAt",
      render: (date) => DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_MED),
    },
    {
      title: "Meeting",
      key: "meeting",
      dataIndex: "meeting",
      render: (meetingLink) => (
        <Space size="middle">
          <Button type="dashed">
            <a type="primary" href={meetingLink} target="_blank">
              {userType === "secretary" ? "Start" : "Join"}
            </a>
          </Button>
        </Space>
      ),
    },
    {
      title: "Resolution",
      key: "resolution",
      dataIndex: "resolution",
      render: (resolution) => (
        <Space size="middle">
          <Button
            type="primary"
            disabled={userType === "COMMITTEE"}
            onClick={() => {
              setCurrentGrievanceId(resolution.id);
              setCurrentGrievanceCollegeName(resolution.collegeName);
              setShowResolutionFormModal(true);
            }}
          >
            Create
          </Button>
        </Space>
      ),
    },
  ];
};

export const processedGrievanceColumn = ({
  userType,
  setCurrentGrievanceId,
  setShowActionTakenReportModal,
  showMessage,
  setShowMessage,
  setShowDocumentsModal,
  setCurrentDocument,
  setResolutionWritten,
  setShowResolutionWrittenModal,
  setCurrentGrievanceCollegeName,
  setShowScheduleNewMeetingModal,
  setCurrentGrievanceAuthorEmail,
}) => {
  return [
    {
      title: "Subject",
      dataIndex: "title",
      key: "subject",
      render: (title) => (
        <Link style={{ color: "#5a6270" }} to={userType === "SECRETARY" ? `/secretary/grievance/${title.id}` : `/committee/grievance/${title.id}`}>
          {title.title}
        </Link>
      ),
    },
    {
      title: "Against",
      dataIndex: "complaintAgainst",
      key: "against",
      render: (text) => <span style={{ fontWeight: "bold" }}>{text}</span>,
    },

    {
      title: "Date",
      key: "date",
      dataIndex: "allotedAt",
      render: (date) => DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_MED),
    },
    {
      title: "New Meeting",
      key: "scheduleNewMeeting",
      dataIndex: "scheduleNewMeeting",
      render: ({ authorEmail, id }) => (
        <Button
          disabled={userType === "COMMITTEE"}
          onClick={() => {
            setCurrentGrievanceId(id);
            setCurrentGrievanceAuthorEmail(authorEmail);
            setShowScheduleNewMeetingModal(true);
          }}
        >
          Schedule
        </Button>
      ),
    },
    {
      title: "Resolution",
      key: "resolution",
      dataIndex: "resolutionWritten",
      render: ({ resolutionWritten, collegeName }) => {
        return (
          <>
            <Space size="middle">
              <Button
                type="dashed"
                onClick={() => {
                  setShowResolutionWrittenModal(true);
                  setCurrentGrievanceCollegeName(collegeName);
                  setResolutionWritten(resolutionWritten);
                }}
              >
                View
              </Button>
            </Space>
          </>
        );
      },
    },
    {
      title: "Replies",
      key: "reply",
      dataIndex: "reply",
      render: ({ documents, comments, numOfReplies }) => (
        <Space size="middle">
          <Dropdown
            overlay={() => menu({ documents, comments, showMessage, setShowMessage, setShowDocumentsModal, setCurrentDocument })}
            placement="bottomCenter"
            arrow
          >
            <Badge count={numOfReplies}>
              <Button>show</Button>
            </Badge>
          </Dropdown>
        </Space>
      ),
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "resolution",
      render: ({ id, collegeName }) => (
        <Space size="middle">
          <Popconfirm
            title="are you sure?"
            okText="Yes"
            onConfirm={() => {
              setCurrentGrievanceId(id);
              setCurrentGrievanceCollegeName(collegeName);
              setShowActionTakenReportModal(true);
            }}
            onCancel={() => {}}
            cancelText="No"
          >
            <Button disabled={userType === "COMMITTEE"} type="primary">
              Solved?
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
};
