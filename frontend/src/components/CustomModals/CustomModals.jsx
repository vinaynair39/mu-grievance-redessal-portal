import React, { useState, useEffect } from "react";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Form, Input, Modal, List, Radio, DatePicker } from "antd";

export const OtpOnlyModal = ({ visible, title, onSubmit, onCancel, loading }) => {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState(); // To disable submit button at the beginning.

  useEffect(() => {
    forceUpdate({});
  }, []);

  return (
    <Modal
      visible={visible}
      title={title}
      okText="Submit"
      confirmLoading={loading}
      onCancel={onCancel}
      closable={false}
      onOk={() => {
        form
          .validateFields()
          .then(({ otp }) => {
            const email = sessionStorage.getItem("email");
            onSubmit({ otp, email });
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form form={form} data-testid="">
        <Form.Item
          name="otp"
          rules={[
            {
              required: true,
              message: "Please enter the OTP sent to you on your email",
            },
          ]}
        >
          <Input size="large" data-testid="login__email" prefix={<LockOutlined className="site-form-item-icon" />} placeholder="OTP" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export const ResetPasswordModal = ({ visible, title, onSubmit, onCancel, loading }) => {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState(); // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({});
  }, []);

  return (
    <Modal
      visible={visible}
      title={title}
      okText="Submit"
      onCancel={onCancel}
      confirmLoading={loading}
      closable={false}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            delete values.confirmPassword;
            const submitData = {
              ...values,
              email: sessionStorage.getItem("email"),
            };
            onSubmit(submitData);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form form={form} data-testid="">
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please Enter Your Password!",
            },
          ]}
        >
          <Input.Password size="large" prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          rules={[
            {
              required: true,
              message: "Please Enter Your Confirm Password!",
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }

                return Promise.reject("The two passwords doesn't match!");
              },
            }),
          ]}
        >
          <Input.Password size="large" prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Confirm Password" />
        </Form.Item>
        <Form.Item
          name="resetCode"
          rules={[
            {
              required: true,
              message: "Please enter the OTP which was sent to your email",
            },
          ]}
        >
          <Input size="large" prefix={<LockOutlined className="site-form-item-icon" />} placeholder="OTP" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export const ForgotPasswordModal = ({ visible, title, onSubmit, onCancel, loading }) => {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState(); // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({});
  }, []);

  return (
    <Modal
      visible={visible}
      title={title}
      okText="Submit"
      onCancel={onCancel}
      confirmLoading={loading}
      closable={false}
      onOk={() => {
        form
          .validateFields()
          .then(({ email }) => {
            onSubmit(email);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form form={form} data-testid="">
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please Enter Your registed email!",
            },
          ]}
        >
          <Input size="large" prefix={<MailOutlined className="site-form-item-icon" />} type="email" placeholder="Email" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export const MessageReplyFromPrincipalModal = ({ comments, visible, onOk }) => (
  <Modal
    closable={false}
    visible={visible}
    bodyStyle={{
      padding: "1rem",
    }}
    cancelButtonProps={{ style: { display: "none" } }}
    onOk={onOk}
  >
    <List bordered dataSource={comments} renderItem={(item) => <List.Item>{item}</List.Item>} />
  </Modal>
);

export const ScheduleNewMeetingModal = ({ authorEmail, onCreate, id, visible, isLoading, onCancel }) => {
  const [radio, setRadio] = useState(null);
  const [date, setDate] = useState(null);

  const onRadioChange = (e) => {
    const meetingType = e.target.value;
    setRadio(meetingType);
  };

  const onSubmit = () => {
    onCreate({
      id,
      payload: {
        email: authorEmail,
        meetingType: radio,
        date,
      },
    });
  };

  return (
    <Modal
      closable={false}
      visible={visible}
      bodyStyle={{
        padding: "2rem 1rem",
        height: "20vh",
      }}
      confirmLoading={isLoading}
      okText="Create"
      onCancel={onCancel}
      onOk={onSubmit}
      okButtonProps={{
        disabled: !(!!radio && !!date),
      }}
    >
      <div className="ScheduleNewMeetingModal" style={{ display: "flex", alignItems: "center", textAlign: "center", justifyContent: "space-around" }}>
        <div className="ListItem__content-type" style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ marginBottom: "1rem" }} className="label">
            Meeting Type:
          </span>
          <Radio.Group onChange={onRadioChange} value={radio}>
            <Radio value={"VIRTUAL"}>Virtual</Radio>
            <Radio value={"IN_PERSON"}>Person</Radio>
          </Radio.Group>
        </div>
        <div className="ListItem__content-time" style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ marginBottom: "1rem" }} className="label">
            Date:
          </span>

          <DatePicker
            showTime={{ user12hours: true, format: "HH:mm A" }}
            format="DD-MM-YY HH:mm"
            allowClear={false}
            placeholder="Allot Date"
            onChange={(value, dateString) => {
              setDate(value.toISOString());
            }}
            disabledDate={(current) => {
              return current && current < Date.now();
            }}
          />
        </div>
      </div>
    </Modal>
  );
};
