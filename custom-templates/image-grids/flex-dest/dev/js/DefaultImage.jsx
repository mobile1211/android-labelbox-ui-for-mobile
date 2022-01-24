import React from 'react';

export default function DefaultImage({ imgObj, idx, isSelected, onClickImage }) {
  const photoLink = imgObj.photoLink?.includes("?")
    ? `${imgObj.photoLink}`
    : `${imgObj.photoLink}?img_w=720`;
  const listingId = imgObj.listingId;

  return (
    <div
      className="image-container"
      onClick={() => onClickImage(idx)}
      tabIndex={idx}
      id={`image-container-${listingId}`}
    >
      <img src={photoLink} className={`image ${isSelected ? 'image-selected' : ''}`} />
    </div>
  );
}