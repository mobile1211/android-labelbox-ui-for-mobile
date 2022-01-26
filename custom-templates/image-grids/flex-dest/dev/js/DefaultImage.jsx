import React from 'react';
import usePhotoEdits from './usePhotoEdits';

export default function DefaultImage({
  imgObj,
  idx,
  isSelected,
  onClickImage,
}) {
  const photoLink = imgObj.photoLink?.includes('?')
    ? `${imgObj.photoLink}`
    : `${imgObj.photoLink}?img_w=720`;
  const listingId = imgObj.listingId;
  const { photoEdits } = usePhotoEdits();
  const isChanged = photoEdits.find(
    (edit) => edit.listingId === imgObj.listingId
  );

  return (
    <div
      className="image-container"
      onClick={() => onClickImage(idx)}
      id={`image-container-${listingId}`}
    >
      <img
        src={photoLink}
        className={`default-image ${isChanged ? 'image-changed' : ''} ${
          isSelected ? 'image-selected' : ''
        }`}
      />
    </div>
  );
}
