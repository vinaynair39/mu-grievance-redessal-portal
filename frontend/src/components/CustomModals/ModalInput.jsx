import React, { useEffect } from "react";
import { Modal, Form, Input, List } from "antd";
import "./ModalInput.scss";
import { fetchEmailIdOfPrincipal } from "APIs/grievance";
import { useQuery } from "react-query";
import { errorMessage } from "utils/modalMessage";

const ModalInput = ({ visible = false, onCreate, onCancel, title = "Please Write the reason for rejection", label = "Reason" }) => {
  const [form] = Form.useForm();

  return (
    <div className="ModalInput">
      <Modal
        visible={visible}
        title={title}
        okText="Submit"
        cancelText="Cancel"
        onCancel={onCancel}
        closable={false}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              onCreate(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            modifier: "public",
          }}
        >
          <Form.Item
            name="reason"
            label={label}
            rules={[
              {
                required: true,
                message: title,
              },
            ]}
          >
            <Input.TextArea autoSize={{ minRows: 6 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const InvitePrincipalModal = ({
  visible = false,
  onCreate,
  onCancel,
  title = "Please Write the Email ID of the Principal of the college against whom the Grievance is",
  label = "email id",
  collegeName,
  id,
  isLoading,
}) => {
  const { isLoading: fetchEmailLoading, data } = useQuery(["fetchEmailId", collegeName], fetchEmailIdOfPrincipal, {
    onError: errorMessage,
    retry: 0,
  });
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      recipient: !!data ? data.email : "",
    });
  }, [data]);

  return (
    <div className="ModalInput">
      <Modal
        visible={visible}
        title={title}
        okText={title === "Enter your registered Email Id" ? "Send" : "Invite"}
        cancelText="Cancel"
        closable={false}
        confirmLoading={isLoading}
        onCancel={onCancel}
        onOk={() => {
          form
            .validateFields()
            .then(({ recipient }) => {
              onCreate({ id, principalEmail: recipient, collegeName });
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            modifier: "public",
          }}
        >
          <Form.Item
            name="recipient"
            label={label}
            rules={[
              {
                required: true,
                message: title,
              },
            ]}
          >
            <Input placeholder="" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const ModalATR = ({ visible = false, onCreate, onCancel, title, collegeName, id, isLoading }) => {
  const [form] = Form.useForm();
  const { isLoading: fetchEmailLoading, data } = useQuery(["fetchEmailIdForATR", collegeName], fetchEmailIdOfPrincipal, {
    onError: errorMessage,
    retry: 0,
  });

  useEffect(() => {
    form.setFieldsValue({
      recipient: !!data ? data.email : "",
    });
  }, [data]);

  return (
    <div className="ModalATR">
      <Modal
        visible={visible}
        confirmLoading={isLoading}
        title={title}
        okText="Create"
        cancelText="Cancel"
        closable={false}
        onCancel={onCancel}
        onOk={() => {
          form
            .validateFields()
            .then(({ subject, body, recipient }) => {
              onCreate({ body, subject, id, principalEmail: recipient, collegeName });
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            modifier: "public",
          }}
        >
          <Form.Item
            name="recipient"
            label="Recipient"
            rules={[
              {
                required: true,
                message: "Please enter the recipient!",
              },
            ]}
          >
            <Input placeholder="Enter recipient email id" />
          </Form.Item>
          <Form.Item
            name="subject"
            label="Subject"
            rules={[
              {
                required: true,
                message: "Please enter the subject!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="body"
            label="Body"
            rules={[
              {
                required: true,
                message: "Please enter the body!",
              },
            ]}
          >
            <Input.TextArea autoSize={{ minRows: 8 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const ResolutionWrittenModal = ({ resolutions, visible, onOk }) => (
  <Modal
    closable={false}
    visible={visible}
    bodyStyle={{
      padding: "1rem",
    }}
    cancelButtonProps={{ style: { display: "none" } }}
    onOk={onOk}
  >
    <List
      bordered
      dataSource={resolutions}
      renderItem={(item) => (
        <List.Item>
          <h2>{item.subject}</h2>
          {item.body}
        </List.Item>
      )}
    />
  </Modal>
);

const replyFromPrincipalModal = (comments, showMessage, setShowMessage) => (
  <Modal
    closable={false}
    visible={showMessage}
    bodyStyle={{
      padding: "1rem",
    }}
    cancelButtonProps={{ style: { display: "none" } }}
    onOk={() => setShowMessage(false)}
  >
    <List bordered dataSource={comments} renderItem={(item) => <List.Item>{item}</List.Item>} />
  </Modal>
);

export { ModalInput as default, ModalATR, InvitePrincipalModal, ResolutionWrittenModal, replyFromPrincipalModal };
