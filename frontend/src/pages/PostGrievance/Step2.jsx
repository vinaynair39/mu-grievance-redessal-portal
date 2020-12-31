import React, { useState, useEffect } from "react";
import { Form, Modal, Input, Select, Button, Upload, notification } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./Step1.scss";
import "./PostGrievance.scss";
import { getBase64 } from "utils/getBase64";

const Step2 = ({
  step,
  setStep,
  edit,
  supportingDocsProps,
  cgrcDocsProps,
  supportingDocsState,
  setSupportingDocsState,
  cgrcDocsState,
  setCgrcDocsState,
  onSubmit,
  formData,
  setFormData,
  updateGrievanceLoading,
  createGrievanceLoading,
}) => {
  const { Option } = Select;

  const [form2] = Form.useForm();
  const [, forceUpdate] = useState(); // To disable submit button at the beginning.

  const openNotificationWithIcon = () => {
    notification.info({
      message: "Tips",
      description: "1. You can upload multiple images.\n2. Keep the subject short and informative.\n3. Give as much description of your grievance as possible.",
      duration: 5,
    });
  };

  useEffect(() => {
    form2.setFieldsValue({
      ...formData,
    });
    openNotificationWithIcon();
    forceUpdate({});
  }, []);

  const onFinish = (values) => {
    if (edit) {
      let supportingDocsUrls = supportingDocsState.supportingDocsFileList.filter((ele) => !!ele.url);
      supportingDocsUrls = supportingDocsUrls.map((ele) => ele.url);
      let cgrcDocsUrls = cgrcDocsState.cgrcDocsFileList.filter((ele) => !!ele.url);
      cgrcDocsUrls = cgrcDocsUrls.map((ele) => ele.url);
      console.log(values);
      onSubmit({ ...formData, ...values, cgrcDocsUrls, supportingDocsUrls });
    } else {
      onSubmit({ ...formData, ...values });
    }
  };

  const onPrevious = () => {
    setFormData({ ...formData, ...form2.getFieldValue() });
    if (step <= 0 || step === 1) {
      setStep(1);
    } else {
      setStep(step - 1);
    }
  };

  const handleCancelSupportingDocs = () => setSupportingDocsState({ ...supportingDocsState, supportingDocsPreviewVisible: false });

  const handlePreviewSupportingDocs = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setSupportingDocsState({
      ...supportingDocsState,
      supportingDocsPreviewImage: file.url || file.preview,
      supportingDocsPreviewVisible: true,
      supportingDocsPreviewTitle: file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    });
  };

  const handleChangeSupportingDocs = ({ file, fileList }) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (file.size <= 1097152 && isJpgOrPng) {
      return setSupportingDocsState({
        ...supportingDocsState,
        supportingDocsFileList: fileList.filter((file) => (file.size <= 1097152 && file.type === "image/jpeg") || file.type === "image/png"),
      });
    }
  };

  // for cgrc

  const handleCancelCgrcDocs = () => {
    setCgrcDocsState({ ...cgrcDocsState, cgrcDocsPreviewVisible: false });
  };

  const handlePreviewCgrcDocs = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setCgrcDocsState({
      ...cgrcDocsState,
      cgrcgDocsPreviewImage: file.url || file.preview,
      cgrcDocsPreviewVisible: true,
      cgrcgDocsPreviewTitle: file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    });
  };

  const handleChangeCgrcDocs = ({ file, fileList }) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";

    if (file.size <= 1097152 && isJpgOrPng) {
      return setCgrcDocsState({
        ...cgrcDocsState,
        cgrcDocsFileList: fileList.filter((file) => (file.size <= 1097152 && file.type === "image/jpeg") || file.type === "image/png"),
      });
    }
  };

  const { supportingDocsPreviewVisible, supportingDocsPreviewImage, supportingDocsFileList, supportingDocsPreviewTitle } = supportingDocsState;
  const { cgrcDocsPreviewVisible, cgrcgDocsPreviewImage, cgrcDocsFileList, cgrcgDocsPreviewTitle } = cgrcDocsState;
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">Upload</div>
    </div>
  );
  return (
    <Form form={form2} onFinish={onFinish}>
      <div className="Step">
        <div className="blocks">
          <div className="block">
            <Form.Item
              label="Semester"
              name="semester"
              rules={[
                {
                  required: true,
                  message: "Please enter your semsester",
                },
              ]}
              className="form-label"
            >
              <Select placeholder="Select your Semester" allowClear size="large">
                <Option value={1}>I</Option>
                <Option value={2}>II</Option>
                <Option value={3}>III</Option>
                <Option value={4}>IV</Option>
                <Option value={5}>V</Option>
                <Option value={6}>VI</Option>
                <Option value={7}>VII</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Roll Number"
              name="rollNo"
              rules={[
                {
                  required: true,
                  message: "Please eneter your roll no",
                },
              ]}
              className="form-label"
            >
              <Input size="large" placeholder="Enter your Roll no here" />
            </Form.Item>
            <Form.Item label="Upload supporting documents for your grievance" className="form-label" listType="picture-card">
              <Upload
                {...supportingDocsProps}
                listType="picture-card"
                onPreview={handlePreviewSupportingDocs}
                fileList={supportingDocsFileList}
                onChange={handleChangeSupportingDocs}
              >
                {supportingDocsFileList.length >= 3 ? null : uploadButton}
              </Upload>
            </Form.Item>
            <Form.Item label="Upload any documents from CGRC (College Grievance Redressal Cell)" className="form-label" style={{ marginBottom: "0" }}>
              <Upload {...cgrcDocsProps} listType="picture-card" onPreview={handlePreviewCgrcDocs} fileList={cgrcDocsFileList} onChange={handleChangeCgrcDocs}>
                {cgrcDocsFileList.length >= 3 ? null : uploadButton}
              </Upload>
            </Form.Item>
            <Modal visible={supportingDocsPreviewVisible} title={supportingDocsPreviewTitle} footer={null} onCancel={handleCancelSupportingDocs}>
              <img alt="example" style={{ width: "100%" }} src={supportingDocsPreviewImage} />
            </Modal>
            <Modal visible={cgrcDocsPreviewVisible} title={cgrcgDocsPreviewTitle} footer={null} onCancel={handleCancelCgrcDocs}>
              <img alt="example" style={{ width: "100%" }} src={cgrcgDocsPreviewImage} />
            </Modal>
          </div>
          <div className="block">
            <Form.Item
              label="Staff/Section against whom the complaint to be Lodged"
              name="complaintAgainst"
              className="form-label"
              rules={[
                {
                  required: true,
                  message: "Please Enter the name of staff against whom the complaint is to be Lodged",
                },
              ]}
            >
              <Input size="large" placeholder="e.g. principal of your college" />
            </Form.Item>
            <Form.Item
              label="Subject of your Grievance"
              name="title"
              className="form-label"
              rules={[
                {
                  required: true,
                  message: "Please enter a subject",
                },
              ]}
            >
              <Input size="large" placeholder="e.g. College is refusing to give me back my marksheet" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description of your Grievance"
              className="form-label"
              style={{ marginBottom: "0" }}
              rules={[
                {
                  required: true,
                  message: "Please enter a description for your grievance",
                },
              ]}
            >
              <Input.TextArea autoSize={{ minRows: 9 }} />
            </Form.Item>
            <div className="flex-button">
              <Button type="primary" onClick={onPrevious} style={{ marginTop: "4vh" }}>
                Previous
              </Button>
              <Form.Item shouldUpdate>
                {() => (
                  <div className="flex-button">
                    <Button
                      style={{ marginTop: "4vh" }}
                      type="primary"
                      htmlType="submit"
                      loading={updateGrievanceLoading || createGrievanceLoading}
                      disabled={
                        !form2.isFieldsTouched(false) ||
                        form2.getFieldsError().filter(({ errors }) => errors.length).length ||
                        updateGrievanceLoading ||
                        createGrievanceLoading
                      }
                    >
                      {updateGrievanceLoading || createGrievanceLoading ? "Submitting" : "Submit"}
                    </Button>
                  </div>
                )}
              </Form.Item>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default Step2;
