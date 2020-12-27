import React, { useState } from "react";
import { Button, Modal } from "antd";
import { ShowImage } from "utils/ShowImage";

export const StudentInfoModal = ({ visible = false, onOk, author: { studentInfo, email } = {} }) => {
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  return (
    <Modal
      title="Student Info"
      onOk={onOk}
      visible={visible}
      closable={false}
      footer={[
        <Button
          key="signature"
          type="secondary"
          onClick={() => {
            setShowDocumentsModal(true);
          }}
        >
          show signature
        </Button>,
        <Button key="submit" type="primary" onClick={onOk}>
          Ok
        </Button>,
      ]}
    >
      {!!studentInfo && (
        <>
          <ShowImage documents={[studentInfo.signatureUrl]} visible={showDocumentsModal} close={() => setShowDocumentsModal(false)} />
          <div className="ViewGrievance__modal">
            <div className="ViewGrievance__modal-first">
              <div style={{ marginBottom: "2vh" }}>
                <span style={{ fontWeight: "bold" }}>Name: </span>
                {studentInfo.fullName}
              </div>
              <div style={{ marginBottom: "2vh" }}>
                <span style={{ fontWeight: "bold" }}>Gender: </span>
                {studentInfo.gender}
              </div>
              <div style={{ marginBottom: "2vh" }}>
                <span style={{ fontWeight: "bold" }}>Email: </span>
                {email}
              </div>
              <div style={{ marginBottom: "2vh" }}>
                <span style={{ fontWeight: "bold" }}>Phone Number: </span>
                {studentInfo.phoneNumber}
              </div>
              <div style={{ marginBottom: "2vh" }}>
                <span style={{ fontWeight: "bold" }}>Roll Number: </span>
                {studentInfo.rollNo}
              </div>
            </div>
            <div className="ViewGrievance__modal-second">
              <div style={{ marginBottom: "2vh", fontWeight: "bold", background: "#E5435A", color: "white", width: "fit-content", padding: "0.2rem 0.3rem" }}>
                <span>College:</span> {studentInfo.collegeName} {studentInfo.sem}
              </div>
              <div style={{ marginBottom: "2vh" }}>
                <span style={{ fontWeight: "bold" }}>Field of Study: </span>
                {studentInfo.fieldOfStudy}
              </div>
              <div style={{ marginBottom: "2vh" }}>
                <span style={{ fontWeight: "bold" }}>Area of Study: </span>
                {studentInfo.areaOfStudy}
              </div>
              <div style={{ marginBottom: "2vh" }}>
                <span style={{ fontWeight: "bold" }}>Program of Study: </span>
                {studentInfo.programOfStudy}
              </div>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};
