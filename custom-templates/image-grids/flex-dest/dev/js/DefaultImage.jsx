import React from 'react';

export default function DefaultImage({
  hasQualityTierChanged,
  imgObj,
  idx,
  isEdited,
  isSelected,
  onClickImage,
}) {
  const photoLink = imgObj.photoLink?.includes('?')
    ? `${imgObj.photoLink}`
    : `${imgObj.photoLink}?img_w=720`;
  const listingId = imgObj.listingId;

  return (
    <div
      className="image-container"
      onClick={() => onClickImage(idx)}
      id={`image-container-${listingId}`}
    >
      <img
        src={photoLink}
        className={`default-image ${
          hasQualityTierChanged ? 'image-quality-changed' : ''
        } ${isEdited ? 'image-edited' : ''} ${
          isSelected ? 'image-selected' : ''
        }`}
      />
    </div>
  );
}
