import React from 'react';

export default function AdditionalImage({ isSelected, listingImage, onClick }) {
  return (
    <div className="additional-image-wrapper">
      <div>Photo ID: {listingImage.photoId}</div>
      <button
        className={`additional-image ${isSelected ? 'image-selected' : ''}`}
        onClick={() => onClick(listingImage.photoId)}
      >
        <img src={listingImage.photoLink} width="100%" />
      </button>
    </div>
  );
}
