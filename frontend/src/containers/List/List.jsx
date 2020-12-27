import React, { useContext, useEffect, useState } from "react";
import { Pagination } from "antd";
import ListItem from "components/ListItem/ListItem";
import Lottie from "lottie-react-web";
import animation from "assets/complete.json";
import CustomCard from "components/Card/Card";
import Context from "context/context";

import "./List.scss";

const numEachPage = 3; // Use a constant here to keep track of number of cards per page

const List = ({
  grievances,
  allocateDate,
  forPrincipal = false,
  card = false,
  isLoading = false,
  rejectMutation,
  selectMutation,
  rejectGrievanceLoading,
  selectGrievanceLoading,
}) => {
  const [sequence, setSequence] = useState({
    minValue: 0,
    maxValue: numEachPage,
  });
  const {
    state: { userType },
  } = useContext(Context);

  const handleChange = (value) => {
    setSequence({
      minValue: (value - 1) * numEachPage,
      maxValue: value * numEachPage,
    });
  };

  return (
    <div className="List animate__animated animate__fadeIn">
      <>
        {grievances.length > 0 ? (
          <>
            {grievances
              .slice(sequence.minValue, sequence.maxValue)
              .map((item) =>
                !card ? (
                  <ListItem key={item.id} {...item} forPrincipal={forPrincipal} userType={userType} allocateDate={allocateDate} isLoading={isLoading} />
                ) : (
                  <CustomCard
                    key={item.id}
                    {...item}
                    forPrincipal={forPrincipal}
                    userType={userType}
                    rejectMutation={rejectMutation}
                    selectMutation={selectMutation}
                    rejectGrievanceLoading={rejectGrievanceLoading}
                    selectGrievanceLoading={selectGrievanceLoading}
                  />
                )
              )}
            <div className="List__pagination">
              <Pagination defaultCurrent={1} defaultPageSize={numEachPage} onChange={handleChange} total={grievances.length} />
            </div>
          </>
        ) : (
          <div className="List__completed">
            <h1 className="animate__animated animate__fadeIn">Looks Like we don't have any more grievances!</h1>
            <div className="List__completed-animation animate__animated animate__fadeIn">
              <Lottie
                options={{
                  animationData: animation,
                }}
              />
            </div>
          </div>
        )}
      </>
    </div>
  );
};
export default List;
