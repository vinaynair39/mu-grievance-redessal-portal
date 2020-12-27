import React, { useState } from "react";
import { Upload, Button, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./Upload.scss";

import { useParams } from "react-router-dom";
import ModalInput from "components/CustomModals/ModalInput";
import { getBase64 } from "utils/getBase64";
import { blobsToBase64s } from "utils/getBase64";

const TempUpload = ({ actionTakenByPrincipal, onSubmit, isLoading }) => {
  const [documents, setDocuments] = useState([]);
  const [visible, setVisible] = useState(false);

  const { id } = useParams();

  const [state, setState] = useState({
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: actionTakenByPrincipal.documents.map((ele, index) => ({
      uid: index,
      size: 1007152,
      type: "image/png",
      url: ele,
      status: "done",
      name: "grievance",
    })),
  });

  const uploadProps = {
    onRemove: (file) => {
      const index = documents.indexOf(file);
      const newFileList = documents.slice();
      newFileList.splice(index, 1);
      setDocuments(newFileList);
    },
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";

      if (isJpgOrPng) {
        if (file.size <= 2097152) {
          Object.defineProperty(file, "name", {
            writable: true,
            value: `grievanceDocument${documents.length + 1}`,
          });
          setDocuments([...documents, file]);
        } else {
          Modal.error({
            title: "Please upload an image of size less than 2mb",
          });
        }
      } else {
        Modal.error({
          title: "Only jpeg/jpg and png format supported!",
        });
      }
      return false;
    },
    fileList: documents,
  };

  const handleCancel = () => setState({ ...state, previewVisible: false });
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setState({
      ...state,
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    });
  };

  const handleChange = ({ file, fileList }) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (file.size <= 2097152 && isJpgOrPng) {
      return setState({ ...state, fileList: fileList.filter((file) => (file.size <= 2097152 && file.type === "image/jpeg") || file.type === "image/png") });
    }
  };

  const { previewVisible, previewImage, fileList, previewTitle } = state;
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">Add Images</div>
    </div>
  );

  const onUploadImage = async () => {
    const data = await blobsToBase64s(documents);
    onSubmit({ id, payload: { documents: data, comments: [] } });
  };

  const onCreateComment = (values) => {
    onSubmit({ id, payload: { comments: [values.reason] } });
    setVisible(false);
  };

  return (
    <>
      <ModalInput visible={visible} onCreate={onCreateComment} onCancel={() => setVisible(false)} title="Enter your Message" label="Message" />
      <div className="Temp__upload">
        <div className="Temp__upload-heading">
          <h1>Your response</h1>
        </div>
        <div className="Temp__upload-comment">
          <Button type="primary" onClick={() => setVisible(true)} style={{ marginRight: "8px" }}>
            Send Message
          </Button>
        </div>
        <div className="Temp__upload-dragger">
          <Upload {...uploadProps} listType="picture-card" onPreview={handlePreview} fileList={fileList} onChange={handleChange}>
            {uploadButton}
          </Upload>
          <Button size="large" style={{ marginRight: "8px" }} onClick={onUploadImage} disabled={isLoading || documents.length === 0} loading={isLoading}>
            Upload Image
          </Button>
          <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </Modal>
        </div>
      </div>
    </>
  );
};

export default TempUpload;
