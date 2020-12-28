import React, { useState, useEffect } from "react";
import { Form, Input, Modal } from "antd";

export const ReasonModal = ({ visible = false, title, onSubmit, onCancel, loading, label, valueName }) => {
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
          .then((values) => {
            onSubmit(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form form={form} data-testid="">
        <Form.Item
          name={valueName}
          label={label}
          rules={[
            {
              required: true,
              message: "Please enter the reason.",
            },
          ]}
        >
          <Input.TextArea autoSize={{ minRows: 6 }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReasonModal;
