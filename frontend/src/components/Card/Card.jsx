import React, { useState } from "react";
import { PageHeader, Button, Typography, Row, Popconfirm, message } from "antd";
import { DateTime } from "luxon";
import { Link } from "react-router-dom";

import useWindowSize from "utils/useWindowSize";
import docSvg from "assets/docs.svg";
import profilePic from "assets/avatar.jpg";
import ReasonModal from "components/CustomModals/ReasonModal";
import { ShowImage } from "utils/ShowImage";
import { StudentInfoModal } from "components/CustomModals/StudentInfoModal";

import "./Card.scss";

const { Paragraph } = Typography;

const CustomCard = ({
  id,
  title,
  description,
  status,
  authorEmail,
  createdAt,
  supportingDocsUrls,
  cgrcDocsUrls,
  userType,
  forPrincipal = false,
  author = {},
  rejectMutation,
  selectMutation,
  selectGrievanceLoading,
  rejectGrievanceLoading,
}) => {
  const [currentDocument, setCurrentDocument] = useState([]);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showStudentInfoModal, setShowStudentInfoModal] = useState(false);
  const { width } = useWindowSize();

  const IconLink = ({ src, text }) => (
    <a
      className="example-link"
      onClick={() => {
        text === "View Supporting Documents" ? setCurrentDocument(supportingDocsUrls) : setCurrentDocument(cgrcDocsUrls);
        setShowDocumentsModal(true);
      }}
    >
      <img className="example-link-icon" src={src} alt={text} />
      {text}
    </a>
  );

  const content = (
    <>
      {forPrincipal ? (
        <Paragraph>{description}</Paragraph>
      ) : (
        <Link to={`/secretary/grievance/${id}`}>
          <Paragraph>
            {description.substring(0, width > 1400 ? 300 : 200)} {description.length > (width > 1400 ? 300 : 200) && "...."}
          </Paragraph>
        </Link>
      )}

      <div className="Card__docs">
        <IconLink src={docSvg} text="View Documents From CGRC" />
        <IconLink src={docSvg} text="View Supporting Documents" />
      </div>
    </>
  );

  const Content = ({ children, status }) => {
    return (
      <Row>
        <div style={{ flex: 1 }}>{children}</div>
        <div className="ListItem__content-status" style={{ display: "flex", alignItems: "flex-end" }}>
          <span>{status}</span>
        </div>
      </Row>
    );
  };

  const onReject = ({ message }) => {
    rejectMutation({ id, email: authorEmail, message });
    setShowRejectModal(false);
  };

  console.log(author);
  return (
    <div className="Card">
      <ShowImage documents={currentDocument} visible={showDocumentsModal} close={() => setShowDocumentsModal(false)} />
      <ReasonModal
        visible={showRejectModal}
        onSubmit={onReject}
        onCancel={() => setShowRejectModal(false)}
        title="Please enter the reason for rejecting this grievance (NOTE: this reason will be sent to the student's email)"
        valueName="message"
        label="Reason"
      />

      <StudentInfoModal visible={showStudentInfoModal} onOk={() => setShowStudentInfoModal(false)} id={id} author={author} />
      <PageHeader
        title={forPrincipal ? title : <Link to={(userType === "COMMITTEE" ? "/committee" : "/secretary") + `/grievance/${id}`}>{title}</Link>}
        className="site-page-header"
        subTitle={DateTime.fromISO(createdAt).toLocaleString(DateTime.DATETIME_MED)}
        extra={
          userType === "SECRETARY"
            ? [
                <Popconfirm
                  key="2"
                  title="Are you sure about rejecting this grievance?"
                  okText="Yes"
                  onConfirm={() => setShowRejectModal(true)}
                  cancelText="No"
                >
                  <Button type="primary" loading={rejectGrievanceLoading} style={{ background: "#E5435A", borderColor: "#E5435A" }}>
                    Reject
                  </Button>
                </Popconfirm>,
                <Button
                  key="1"
                  type="primary"
                  loading={selectGrievanceLoading}
                  onClick={() => {
                    selectMutation(id);
                  }}
                >
                  Select
                </Button>,
              ]
            : userType !== "COMMITTEE" && (
                <Button type="primary" onClick={() => setShowStudentInfoModal(true)}>
                  View Student Details
                </Button>
              )
        }
        avatar={{ src: profilePic }}
      >
        <Content status={status}>{content}</Content>
      </PageHeader>
    </div>
  );
};

export default CustomCard;
