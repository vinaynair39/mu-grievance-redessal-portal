import Lightbox from "react-image-lightbox";
import React, { useState, useEffect } from "react";

export const ShowImage = ({ documents, close, visible }) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  useEffect(() => {
    setPhotoIndex(0);
  }, [documents]);

  return visible ? (
    <Lightbox
      mainSrc={documents[photoIndex]}
      nextSrc={documents[photoIndex + 1]}
      prevSrc={documents[photoIndex - 1]}
      onCloseRequest={close}
      onMovePrevRequest={() => setPhotoIndex(photoIndex - 1)}
      onMoveNextRequest={() => setPhotoIndex(photoIndex + 1)}
    />
  ) : (
    <></>
  );
};
