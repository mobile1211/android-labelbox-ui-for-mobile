import React from 'react';

export default function GenericImage({ isSelected, listingImage, onClick }) {
  return (
    <div className={`generic-image ${isSelected ? 'image-selected' : ''}`}>
      <div>Photo ID: {listingImage.photoId}</div>
      <button onClick={() => onClick(listingImage.photoId)}>
        <img src={listingImage.photoLink} width="100%" />
      </button>
    </div>
  );
}
