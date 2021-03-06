import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DateTime } from "luxon";
import { Button, DatePicker, Radio } from "antd";
import "./ListItem.scss";

const ListItem = ({ title, createdAt, id, status, authorEmail, meetingType, userType, allocateDate }) => {
  const [radio, setRadio] = useState(meetingType ? "VIRTUAL" : "IN_PERSON");
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const onRadioChange = (e) => {
    const meetingType = e.target.value;
    setRadio(meetingType);
  };

  const onSubmit = async () => {
    setLoading(true);
    await allocateDate({
      id,
      payload: {
        email: authorEmail,
        meetingType: radio,
        date,
      },
    });
    setLoading(false);
  };

  return (
    <div className="ListItem">
      <div className="ListItem__content">
        <Link to={`/secretary/grievance/${id}`}>
          <div className="ListItem__content-title">{title}</div>
        </Link>
        <div className="ListItem__content-extra">
          <div className="ListItem__content-time">{DateTime.fromISO(createdAt).toLocaleString(DateTime.DATETIME_MED)}</div>
          <div className="ListItem__content-type">
            <span className="label">Meeting Type:</span>
            <Radio.Group onChange={onRadioChange} value={radio}>
              <Radio value={"VIRTUAL"}>Virtual</Radio>
              <Radio value={"IN_PERSON"}>Person</Radio>
            </Radio.Group>
          </div>
          {userType === "SECRETARY" ? (
            <div className="ListItem__content-time">
              <DatePicker
                showTime={{ user12hours: true, format: "HH:mm A" }}
                format="DD-MM-YY HH:mm"
                allowClear={false}
                placeholder="Allot Date"
                onChange={(value) => {
                  setDate(value.format());
                }}
                disabledDate={(current) => {
                  return current && current <= Date.now();
                }}
              />
            </div>
          ) : (
            <Link to={`/secretary/grievance/${id}`}>
              <div className="ListItem__content-status">
                status:<span>{status}</span>
              </div>
            </Link>
          )}
        </div>
      </div>
      <div className="ListItem__select">
        <Button loading={loading} onClick={onSubmit} disabled={!!date ? false : true}>
          {status === "PENDING" || status === "UNDER_PROCESS" ? "Change Date" : "Submit"}
        </Button>
      </div>
    </div>
  );
};

export default ListItem;
