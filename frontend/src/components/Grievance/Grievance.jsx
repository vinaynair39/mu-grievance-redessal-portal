import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Popconfirm } from "antd";
import { FileAddOutlined, CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import { DateTime } from "luxon";

import Context from "context/context";
import ReasonModal from "components/CustomModals/ReasonModal";
import { StudentInfoModal } from "components/CustomModals/StudentInfoModal";
import { ShowImage } from "utils/ShowImage";
import Comment from "components/Comment/Comment";
import "./Grievance.scss";

const Grievance = ({
  grievance,
  rejectMutation,
  selectMutation,
  addCommentMutation,
  author,
  addCommentLoading,
  rejectMutationLoading,
  selectMutationLoading,
}) => {
  const [showStudentInfoModal, setShowStudentInfoModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [currentDocument, setCurrentDocument] = useState([]);
  const [documentType, setDocumentType] = useState("");
  const [showComments, setShowComments] = useState(false);

  const {
    state: { userType },
  } = useContext(Context);

  let { title, complaintAgainst, createdAt, description, authorEmail, id, supportingDocsUrls, cgrcDocsUrls, status, comments } = grievance;

  const onReject = ({ message }) => {
    rejectMutation({ id, email: authorEmail, message });
    setShowRejectModal(false);
  };

  const showCommentsButton = status !== "NEW" && status !== "SELECTED" && userType !== "STUDENT";

  return (
    <div className={"Grievance animate__animated animate__fadeIn"}>
      {showDocumentsModal && <ShowImage documents={currentDocument} visible={showDocumentsModal} close={() => setShowDocumentsModal(false)} />}

      <ReasonModal
        visible={showRejectModal}
        onSubmit={onReject}
        onCancel={() => setShowRejectModal(false)}
        title="Please enter the reason for rejecting this grievance (NOTE: this reason will be sent to the student's email)"
        valueName="message"
        label="Reason"
      />
      <StudentInfoModal visible={showStudentInfoModal} onOk={() => setShowStudentInfoModal(false)} id={id} author={author} />
      <div className={showCommentsButton ? "ViewGrievance" : "ViewGrievance ViewGrievance2"}>
        <div className="ViewGrievance__header">
          <div className="ViewGrievance__title">{title}</div>
          <div className="ViewGrievance__time">{DateTime.fromISO(createdAt).toLocaleString(DateTime.DATETIME_MED)}</div>
        </div>
        <div className="ViewGrievance__data">
          <div className="ViewGrievance__author">
            <Button type="primary" onClick={() => setShowStudentInfoModal(true)}>
              View Student Details
            </Button>
          </div>
          <div className="ViewGrievance__against">{complaintAgainst}</div>
        </div>
        <div className="ViewGrievance__description">{description}</div>
        <div className="ViewGrievance__submit">
          {Array.isArray(cgrcDocsUrls) && (
            <Button
              icon={<FileAddOutlined />}
              loading={showDocumentsModal && documentType === cgrcDocsUrls}
              disabled={cgrcDocsUrls.length === 0}
              onClick={() => {
                setShowDocumentsModal(true);

                setCurrentDocument(cgrcDocsUrls);
              }}
            >
              Documents From CGRC
            </Button>
          )}
          {userType === "STUDENT" && status === "NEW" && (
            <Link to={`/student/edit/${id}`} style={{ color: "#5a6270" }}>
              <Button type="dashed" icon={<EditOutlined />}>
                Edit
              </Button>
            </Link>
          )}
          {userType === "SECRETARY" && status === "NEW" && (
            <Button type="primary" loading={selectMutationLoading} icon={<CheckOutlined />} onClick={() => selectMutation(id)}>
              Select
            </Button>
          )}
          {userType === "SECRETARY" && status === "NEW" && (
            <>
              <Popconfirm title="Are you sure about rejecting this grievance?" okText="Yes" onConfirm={() => setShowRejectModal(true)} cancelText="No">
                <Button type="primary" loading={rejectMutationLoading} icon={<CloseOutlined />} style={{ background: "#E5435A", borderColor: "#E5435A" }}>
                  Reject
                </Button>
              </Popconfirm>
            </>
          )}
          {Array.isArray(supportingDocsUrls) && (
            <Button
              icon={<FileAddOutlined />}
              loading={showDocumentsModal && documentType === supportingDocsUrls}
              disabled={supportingDocsUrls.length === 0}
              onClick={() => {
                setShowDocumentsModal(true);

                setCurrentDocument(supportingDocsUrls);
              }}
            >
              Supporting Documents
            </Button>
          )}
        </div>
      </div>
      {showCommentsButton && (
        <div className="Grievance__comments">
          <Button onClick={() => setShowComments(!showComments)}>{showComments ? "Hide Comments" : "Show Comments"}</Button>
          {showComments && <Comment comments={comments} onSubmit={addCommentMutation} id={id} isLoading={addCommentLoading} />}
        </div>
      )}
    </div>
  );
};

export default Grievance;
