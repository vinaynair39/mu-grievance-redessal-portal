import React, { useContext, useEffect, useRef } from "react";
import { Input, Radio } from "antd";
import Context from "context/context";
import { setTextFilter } from "context/actions";

import "./Filters.scss";

const { Search } = Input;

const Filters = ({ type, onChange, radio = false }) => {
  const searchRef = useRef(null);

  const {
    dispatch,
    state: { filters },
  } = useContext(Context);
  const setSearch = (text) => {
    dispatch(setTextFilter(text));
  };

  useEffect(() => {
    if (filters.text !== "") {
      searchRef.current.focus();
    }
  }, [filters]);

  return (
    <div className="Filters">
      <div className="SearchBar">
        <Search placeholder="Search" ref={searchRef} value={filters.text} onChange={(e) => setSearch(e.target.value)} enterButton />
      </div>
      {radio && (
        <Radio.Group className="Filters__radio" onChange={(e) => onChange(e.target.value)} value={type}>
          <Radio value={"SOLVED"}>Solved</Radio>
          <Radio value={"REJECTED"}>Rejected</Radio>
        </Radio.Group>
      )}
    </div>
  );
};

export default Filters;
