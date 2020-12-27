import React, { useState, useEffect } from "react";
import { useMutation } from "react-query";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { Form, Input, Button, Popconfirm } from "antd";
import { forgotPassword, resetPassword } from "APIs/user";
import { successMessage, errorMessage } from "utils/modalMessage";
import { ForgotPasswordModal, ResetPasswordModal } from "components/CustomModals/CustomModals";
import { validObject } from "utils/validObject";

import "./LoginForm.scss";

const LoginForm = ({ loading = false, onSubmit, setType }) => {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState(); // To disable submit button at the beginning.
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);

  const [forgotPasswordMutation, { isLoading: isForgotPasswordLoading }] = useMutation(forgotPassword, {
    onSuccess: () => {
      setShowForgotPasswordModal(false);
      setShowResetPasswordModal(true);
    },
    onError: ({ response }) => errorMessage(validObject(response) && response.data),
  });

  const [resetPasswordMutation, { isLoading: isResetPasswordLoading }] = useMutation(resetPassword, {
    onSuccess: ({ data: { message } }) => {
      setShowResetPasswordModal(false);
      successMessage(message);
      localStorage.clear();
    },
    onError: ({ response }) => errorMessage(validObject(response) && response.data),
  });

  useEffect(() => {
    forceUpdate({});
  }, []);

  const onFinish = (data) => {
    onSubmit({ data });
  };

  return (
    <>
      <ForgotPasswordModal
        visible={showForgotPasswordModal}
        loading={isForgotPasswordLoading}
        title="Enter your registered Email ID"
        onSubmit={forgotPasswordMutation}
        onCancel={() => setShowForgotPasswordModal(false)}
      />
      <ResetPasswordModal
        title={"An Otp has been sent to your email Id. Enter that otp along with your new password to successfully reset!"}
        visible={showResetPasswordModal}
        loading={isResetPasswordLoading}
        onSubmit={resetPasswordMutation}
        onCancel={() => setShowResetPasswordModal(false)}
      />

      <div className="LoginForm">
        <h1>Login</h1>
        <Form form={form} onFinish={onFinish} data-testid="login__form">
          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                message: "This is not a valid E-mail!",
              },
              {
                required: true,
                message: "Please Enter Your Email",
              },
            ]}
          >
            <Input size="large" data-testid="login__email" prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter your password!",
              },
            ]}
          >
            <Input.Password
              size="large"
              data-testid="login__password"
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <div className="LoginForm__forgot">
            <Popconfirm
              title="An email will be sent to you to change your password"
              okText="Ok"
              onConfirm={() => setShowForgotPasswordModal(true)}
              cancelText="No"
              on
            >
              <a className="LoginForm__forgot-button">Forgot password</a>
            </Popconfirm>
          </div>

          <div className="LoginForm__submit">
            <Form.Item shouldUpdate={true}>
              {() => (
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  disabled={!form.isFieldsTouched(false) || form.getFieldsError().filter(({ errors }) => errors.length).length || loading}
                >
                  {loading ? "Loging in" : "Log in"}
                </Button>
              )}
            </Form.Item>
          </div>

          <div className="LoginForm__register">
            <h5>Not Registered?</h5>
            <Button onClick={() => setType("REGISTER")}>Register</Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default LoginForm;
