import React from 'react';

export default function GenericImage({ listingImage }) {
  return (
    <div className="generic-image">
      <div>Photo ID: {listingImage.photoId}</div>
      <button onClick={() => onClickImage(idx)}>
        <img src={listingImage.photoLink} width="100%" />
      </button>
    </div>
  );
}
