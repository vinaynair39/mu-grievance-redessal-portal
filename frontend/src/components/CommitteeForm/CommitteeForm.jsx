import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button } from "antd";
import { UploadOutlined, MailOutlined, LockOutlined, UserOutlined, NumberOutlined } from "@ant-design/icons";
import useWindowSize from "utils/useWindowSize";
import { collegeNames } from "utils/collegeNames";
import "./CommitteeForm.scss";
import Modal from "antd/lib/modal/Modal";
import { getBase64 } from "utils/getBase64";

const CommitteeForm = ({ formValues = {}, onSubmit, edit, mutationLoading }) => {
  const [form] = Form.useForm();
  const [image, onImage] = useState({
    data: "",
    extension: "",
  });
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const { width } = useWindowSize(0);
  const { Option } = Select;

  useEffect(() => {
    if (edit) {
      form.setFieldsValue({
        ...formValues,
        ...formValues.committeeInfo,
        password: "",
      });
      if (!!formValues.committeeInfo) {
        setCurrentImageUrl(formValues.committeeInfo.imageUrl);
      }
    }
  }, [formValues]);

  const onFinish = async (values) => {
    const data = { ...values, image };
    if (edit) {
      data.imageUrl = currentImageUrl;
      data.image = !!image.data ? image : null;
      onSubmit({ data, id: formValues.id });
    } else {
      onSubmit({ data, userType: "COMMITTEE" });
    }
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 22 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 22 },
      sm: { span: 16 },
    },
  };

  const handleEditPicture = () => {
    const fileInput = document.getElementById("imageChange");
    fileInput.click();
  };

  const onImageChange = async (e) => {
    const blob = e.target.files[0];
    const extension = blob.type === "image/jpeg" ? "jpg" : blob.type.split("/")[1];
    if (extension !== "jpg" && extension !== "png") {
      Modal.error({
        title: "Invalid file ",
        content: "You can only upload jpg or png file",
      });
    } else {
      const url = URL.createObjectURL(blob);
      setCurrentImageUrl(url);
      const base64String = await getBase64(blob);
      onImage({
        extension,
        data: base64String,
      });
    }
  };

  return (
    <div className="CommitteeForm">
      <div className="CommitteeForm__grid animated fadeIn">
        <Form form={form} name="committeeForm" {...formItemLayout} onFinish={onFinish} style={{ marginTop: "1rem" }}>
          <Form.Item
            name="name"
            label="Full Name"
            rules={[
              {
                required: true,
                message: "Please Enter A Name",
              },
            ]}
          >
            <Input size="large" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Your Name" />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[
              {
                required: true,
                message: "Please Enter A Phone Number",
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue("phoneNumber").toString().length === 10) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Phone number should be of 10 digit");
                },
              }),
            ]}
          >
            <Input size="large" prefix={<NumberOutlined className="site-form-item-icon" />} placeholder="Your Phone Number" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please Enter the Email",
              },
            ]}
          >
            <Input size="large" prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="collegeName"
            label="College"
            rules={[
              {
                required: true,
                message: "Please Enter The College Name",
              },
            ]}
          >
            <Select
              showSearch
              style={{ width: width > 1024 ? "25vw" : "100%" }}
              size="large"
              placeholder="Enter your college name"
              optionFilterProp="children"
              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              filterSort={(optionA, optionB) => optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
            >
              {collegeNames.map((d) => {
                return <Option key={d}>{d}</Option>;
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="designation"
            label="Designation"
            size="large"
            rules={[
              {
                required: true,
                message: "Please Enter designation",
              },
            ]}
          >
            <Select placeholder="Your Designation" size="large" style={{ width: width > 1024 ? "25vw" : "100%" }}>
              <Option key={1} value="vice-chancellor">
                Vice Chancellor
              </Option>
              <Option key={2} value="chairperson">
                Chairperson
              </Option>
              <Option key={3} value="professor">
                Professor
              </Option>
              <Option key={4} value="dean">
                Dean
              </Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
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
            label="Confirm Password"
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
          <Form.Item label="Profile Image">
            <>
              <input type="file" hidden="hidden" name="" id="imageChange" onChange={onImageChange} />
              <Button icon={<UploadOutlined />} onClick={handleEditPicture} style={{ marginTop: "2vh" }}>
                {edit ? "Edit Image" : "Add Image"}
              </Button>
            </>
          </Form.Item>
          <div className="CommitteeForm__register">
            <Form.Item shouldUpdate>
              {() => (
                <Button
                  data-testid="login"
                  type="primary"
                  loading={mutationLoading}
                  htmlType="submit"
                  disabled={!form.isFieldsTouched(false) || form.getFieldsError().filter(({ errors }) => errors.length).length || mutationLoading}
                >
                  {edit ? "Edit" : "Register"}
                </Button>
              )}
            </Form.Item>
          </div>
        </Form>
        {
          <div className="CommitteeForm__background">
            {!!currentImageUrl ? <img src={currentImageUrl} alt="" /> : <img src={process.env.PUBLIC_URL + "/profile_pic.png"} alt="" />}
          </div>
        }
      </div>
    </div>
  );
};

export default CommitteeForm;
