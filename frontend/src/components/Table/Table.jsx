import React, { useState, useContext, useEffect } from "react";
import { Tabs, Table } from "antd";
import Lottie from "lottie-react-web";
import animation from "assets/complete.json";
import { ModalATR, InvitePrincipalModal } from "components/CustomModals/ModalInput";
import useWindowSize from "utils/useWindowSize";
import { ShowImage } from "utils/ShowImage";

import { underProcessGrievanceColumn } from "./columns";
import { processedGrievanceColumn } from "./columns";
import { ResolutionWrittenModal } from "components/CustomModals/ModalInput";
import Context from "context/context";

import "./Table.scss";
import { ScheduleNewMeetingModal } from "components/CustomModals/CustomModals";

const { TabPane } = Tabs;

const CustomTable = ({
  heading1,
  heading2,
  data,
  createATRMutation,
  createMeetingMutation,
  createResolutionMutation,
  createInviteMutation,
  createResolutionLoading,
  createATRLoading,
  createInviteLoading,
  createMeetingLoading,
}) => {
  const [currentDocument, setCurrentDocument] = useState([]);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showActionTakenReportModal, setShowActionTakenReportModal] = useState(false);
  const [showResolutionFormModal, setShowResolutionFormModal] = useState(false);
  const [inviteVisible, setInviteVisible] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [resolutionWritten, setResolutionWritten] = useState([]);
  const [showResolutionWrittenModal, setShowResolutionWrittenModal] = useState(false);
  const [showScheduleNewMeetingModal, setShowScheduleNewMeetingModal] = useState(false);
  const [currentGrievanceCollegeName, setCurrentGrievanceCollegeName] = useState("");
  const [currentGrievanceId, setCurrentGrievanceId] = useState();
  const [currentGrievanceAuthorEmail, setCurrentGrievanceAuthorEmail] = useState();
  const [dataSourceA, setDataSourceA] = useState([]);
  const [dataSourceB, setDataSourceB] = useState([]);

  const {
    state: { userType },
  } = useContext(Context);

  const { width } = useWindowSize();

  useEffect(() => {
    const initializeTable = () => {
      let dataA = [];
      let dataB = [];
      data.forEach((ele, index) => {
        if (Array.isArray(ele.resolutionLetter) && ele.resolutionLetter.length > 0) {
          dataB.push({
            key: ele.id,
            allotedAt: ele.allotedAt,
            complaintAgainst: ele.complaintAgainst,
            scheduleNewMeeting: { authorEmail: ele.authorEmail, id: ele.id },

            srNo: {
              index: index + 1,
              id: ele.id,
            },
            title: {
              title: ele.title,
              id: ele.id,
            },
            id: ele.id,
            reply: {
              documents: ele.actionTakenByPrincipal.documents,
              comments: ele.actionTakenByPrincipal.comments,
              numOfReplies: ele.actionTakenByPrincipal.documents.length + ele.actionTakenByPrincipal.comments.length,
            },
            resolutionWritten: {
              resolutionWritten: ele.resolutionLetter,
              collegeName: ele.againstCollegeName,
            },
            resolution: { collegeName: ele.againstCollegeName, invited: ele.invitedPrincial, id: ele.id },
          });
        }
        dataA.push({
          key: ele.id,
          allotedAt: ele.allotedAt,
          complaintAgainst: ele.complaintAgainst,
          srNo: {
            index: index + 1,
            id: ele.id,
          },
          meeting: userType === "SECRETARY" ? ele.meetingStartLink : ele.meetingJoinLink,
          meetingType: ele.meetingType === "IN_PERSON" ? "Personal" : "Virtual",
          title: {
            title: ele.title,
            id: ele.id,
          },
          resolution: { collegeName: ele.againstCollegeName, invited: ele.invitedPrincial, id: ele.id },
        });
      });
      setDataSourceA(dataA);
      setDataSourceB(dataB);
    };
    initializeTable();
  }, [data]);

  const onCreateAtr = (values) => {
    const payload = values;
    createATRMutation({ id: currentGrievanceId, payload });
    setShowActionTakenReportModal(false);
  };

  const onCreateResolution = (values) => {
    const payload = values;
    createResolutionMutation({ id: currentGrievanceId, payload });
    setShowResolutionFormModal(false);
  };

  const inviteOfficals = async (values) => {
    const payload = values;
    createInviteMutation({ payload });
    setInviteVisible(false);
  };

  return (
    <>
      <ShowImage documents={currentDocument} visible={showDocumentsModal} close={() => setShowDocumentsModal(false)} />
      <ResolutionWrittenModal visible={showResolutionWrittenModal} resolutions={resolutionWritten} onOk={() => setShowResolutionWrittenModal(false)} />
      <ModalATR
        visible={showResolutionFormModal}
        onCreate={onCreateResolution}
        onCancel={() => setShowResolutionFormModal(false)}
        title="Create A Resolution Report"
        id={currentGrievanceId}
        collegeName={currentGrievanceCollegeName}
        isLoading={createResolutionLoading}
      />
      <ModalATR
        visible={showActionTakenReportModal}
        onCreate={onCreateAtr}
        onCancel={() => setShowActionTakenReportModal(false)}
        title="Create Action Taken Report"
        id={currentGrievanceId}
        collegeName={currentGrievanceCollegeName}
        isLoading={createATRLoading}
      />
      <InvitePrincipalModal
        visible={inviteVisible}
        onCreate={inviteOfficals}
        onCancel={() => setInviteVisible(false)}
        id={currentGrievanceId}
        collegeName={currentGrievanceCollegeName}
        title={`Please Write the Email ID of the Principal of ${currentGrievanceCollegeName} against whom the Grievance is`}
        isLoading={createInviteLoading}
      />
      <ScheduleNewMeetingModal
        visible={showScheduleNewMeetingModal}
        id={currentGrievanceId}
        authorEmail={currentGrievanceAuthorEmail}
        onCreate={(payload) => {
          createMeetingMutation(payload);
          setShowScheduleNewMeetingModal(false);
        }}
        isLoading={createMeetingLoading}
        onCancel={() => setShowScheduleNewMeetingModal(false)}
      />
      {dataSourceA.length > 0 ? (
        <div className="Table">
          <Tabs defaultActiveKey="1">
            <TabPane tab={heading1} key="1">
              <Table
                columns={underProcessGrievanceColumn({
                  userType,
                  setCurrentGrievanceId,
                  setCurrentGrievanceCollegeName,
                  setInviteVisible,
                  setShowResolutionFormModal,
                })}
                dataSource={dataSourceA}
                pagination={{ position: ["bottomLeft"], defaultPageSize: width > 1366 ? 6 : 4 }}
              />
            </TabPane>
            <TabPane tab={heading2} key="2">
              <Table
                columns={processedGrievanceColumn({
                  userType,
                  setCurrentGrievanceId,
                  setShowActionTakenReportModal,
                  setShowResolutionFormModal,
                  setShowMessage,
                  setCurrentGrievanceCollegeName,
                  showMessage,
                  setShowDocumentsModal,
                  setCurrentDocument,
                  setResolutionWritten,
                  setShowResolutionWrittenModal,
                  setShowScheduleNewMeetingModal,
                  setCurrentGrievanceAuthorEmail,
                })}
                dataSource={dataSourceB}
                pagination={{ position: ["bottomLeft"], defaultPageSize: width > 1366 ? 8 : 4 }}
              />
            </TabPane>
          </Tabs>
        </div>
      ) : (
        <div className="List__completed">
          <h1 className="animate__animated animate__fadeIn">Looks Like we don't have anything here.</h1>
          <div className="List__completed-animation animate__animated animate__fadeIn">
            <Lottie
              options={{
                animationData: animation,
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CustomTable;
