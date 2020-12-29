import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, Upload, Modal } from "antd";
import { collegeNames } from "utils/collegeNames";
import { PlusOutlined } from "@ant-design/icons";

import "./PostGrievance.scss";
import "./Step1.scss";
import { getBase64 } from "utils/getBase64";

const { Option } = Select;

const Step1 = ({ setStep, signature, signatureProps, signatureState, setSignatureState, formData, setFormData }) => {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState(); // To disable submit button at the beginning.

  useEffect(() => {
    form.setFieldsValue({
      ...formData,
    });
    forceUpdate({});
  }, [formData]);

  const onFinish = (values) => {
    setFormData({ ...formData, ...values });
    setStep(2);
  };

  const handleCancel = () => setSignatureState({ ...signatureState, signaturePreviewVisible: false });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setSignatureState({
      ...signatureState,
      signaturePreviewImage: file.url || file.preview,
      signaturePreviewVisible: true,
      signaturePreviewTitle: file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    });
  };

  const handleChangeImage = ({ file, fileList }) => {
    console.log(fileList, file);
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (file.size <= 1097152 && isJpgOrPng) {
      return setSignatureState({
        ...signatureState,
        signatureFileList: fileList.filter((file) => (file.size <= 1097152 && file.type === "image/jpeg") || file.type === "image/png"),
      });
    }
    return;
  };

  const { signaturePreviewVisible, signaturePreviewImage, signatureFileList, signaturePreviewTitle } = signatureState;

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">Upload</div>
    </div>
  );
  return (
    <Form form={form} onFinish={onFinish}>
      <div className="Step">
        <div className="blocks">
          <div className="block">
            <Form.Item
              label="Name"
              name="fullName"
              rules={[
                {
                  required: true,
                  message: "Please enter your full name here",
                },
              ]}
              className="form-label"
            >
              <Input size="large" placeholder="Enter your Full Name " className="form-input" />
            </Form.Item>
            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[
                {
                  required: true,
                  message: "Please enter your phone number here",
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
              className="form-label"
            >
              <Input size="large" placeholder="Enter your phone number" />
            </Form.Item>
            <Form.Item
              label="Gender"
              name="gender"
              rules={[
                {
                  required: true,
                  message: "Please select your gender",
                },
              ]}
              className="form-label"
            >
              <Select placeholder="Select a gender" allowClear size="large">
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="College"
              name="collegeName"
              rules={[
                {
                  required: true,
                  message: "Please Select Your College",
                },
              ]}
              className="form-label"
            >
              <Select
                showSearch
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
          </div>
          <div className="block">
            <Form.Item
              label="Field of Study"
              name="fieldOfStudy"
              className="form-label"
              rules={[
                {
                  required: true,
                  message: "Please enter your field of study",
                },
              ]}
            >
              <Select size="large" placeholder="Enter Field of Study" allowClear>
                <Option value="Science and Technology">Science and Technology</Option>
                <Option value="Commerce and Management">Commerece and Management</Option>
                <Option value="Humanities">Humanities</Option>
                <Option value="Inter-disciplinary Studies">Inter-disciplinary Studies</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Area of Study"
              name="areaOfStudy"
              className="form-label"
              rules={[
                {
                  required: true,
                  message: "Please enter area of study",
                },
              ]}
            >
              <Input size="large" placeholder="e.g. Computer Engineering" />
            </Form.Item>
            <Form.Item
              label="Program of study"
              name="programOfStudy"
              className="form-label"
              rules={[
                {
                  required: true,
                  message: "Please Enter your Program of study",
                },
              ]}
            >
              <Select size="large" placeholder="Select Your Program" allowClear>
                <Option value="UG">Under Graduate</Option>
                <Option value="PG">Post Graduate</Option>
                <Option value="M.PHILL">M.Phill.</Option>
                <Option value="PHD">Ph.D.</Option>
                <Option value="DIPLOMA">Diploma</Option>
                <Option value="OTHERS">Others</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Signature"
              rules={[
                {
                  required: true,
                  message: "Please upload your signature",
                },
              ]}
              className="form-label"
            >
              <Upload
                {...signatureProps}
                size="large"
                listType="picture-card"
                onPreview={handlePreview}
                fileList={signatureFileList}
                onChange={handleChangeImage}
              >
                {signatureFileList.length > 0 ? null : uploadButton}
              </Upload>
              <Modal visible={signaturePreviewVisible} title={signaturePreviewTitle} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: "100%" }} src={signaturePreviewImage} />
              </Modal>
            </Form.Item>
          </div>
        </div>
        <div className="button">
          <Form.Item shouldUpdate>
            {() => (
              <div className="flex-button">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  disabled={
                    !form.isFieldsTouched(false) ||
                    form.getFieldsError().filter(({ errors }) => errors.length).length ||
                    (signature.length === 0 && signatureState.signatureFileList.length === 0)
                  }
                >
                  Next
                </Button>
              </div>
            )}
          </Form.Item>
        </div>
      </div>
    </Form>
  );
};

export default Step1;
