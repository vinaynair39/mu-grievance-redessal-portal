import React, { useState, useEffect } from "react";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { Form, Input, Button } from "antd";

import "./RegisterForm.scss";

const RegisterForm = ({ loading = false, onSubmit, setType }) => {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState(); // To disable submit button at the beginning.

  useEffect(() => {
    forceUpdate({});
  }, []);

  const onFinish = (data) => {
    sessionStorage.setItem("email", data.email);
    delete data.confirmPassword; // removing confirmpassword from the object
    onSubmit({ data, userType: "STUDENT" }); // posting the data to /api/register and if we get a response then show the message that we got in the response
  };

  return (
    <div className="RegisterForm">
      <h1>Register</h1>
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          name="email"
          rules={[
            {
              type: "email",
              message: "This is not valid Email!",
            },
            {
              required: true,
              message: "Please Enter Your Email",
            },
          ]}
        >
          <Input size="large" prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
        </Form.Item>

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

        <div className="RegisterForm__submit">
          <Form.Item shouldUpdate>
            {() => (
              <Button
                data-testid="login"
                type="primary"
                htmlType="submit"
                disabled={!form.isFieldsTouched() || form.getFieldsError().filter(({ errors }) => errors.length).length}
                loading={loading}
              >
                {loading ? "Registering" : "Register"}
              </Button>
            )}
          </Form.Item>
        </div>

        <div className="RegisterForm__register">
          <h5>Already Registered?</h5>
          <Button onClick={() => setType("LOGIN")}>Login</Button>
        </div>
      </Form>
    </div>
  );
};

export default RegisterForm;
