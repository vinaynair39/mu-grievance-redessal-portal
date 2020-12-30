import React, { useState, useEffect } from "react";
import { Comment, Avatar, Form, Button, List, Input } from "antd";

import "./Comment.scss";

const { TextArea } = Input;

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary" disabled={value.length === 0}>
        Add Comment
      </Button>
    </Form.Item>
  </>
);
const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} ${comments.length > 1 ? "replies" : "reply"}`}
    itemLayout="horizontal"
    renderItem={(props) => <Comment {...props} />}
  />
);

const CustomComment = ({ comments = [], onSubmit, isLoading = false, id }) => {
  const [data, setData] = useState([]);
  const [newComment, setNewComment] = useState("");
  const imageUrl = localStorage.getItem("imageUrl");

  useEffect(() => {
    const newData = comments.map((comment) => {
      return {
        author: comment.authorName,
        avatar: comment.authorImageUrl,
        content: <p>{comment.comment}</p>,
      };
    });

    setData(newData);
  }, [comments]);

  return (
    <div className="Comment">
      {comments.length > 0 && <CommentList comments={data} />}
      <Comment
        avatar={<Avatar src={imageUrl} alt="Han Solo" />}
        content={
          <Editor
            onChange={(e) => setNewComment(e.target.value)}
            onSubmit={async () => {
              await onSubmit({ id, payload: { comment: newComment } });
              setNewComment("");
            }}
            submitting={isLoading}
            value={newComment}
          />
        }
      />
    </div>
  );
};
export default CustomComment;
