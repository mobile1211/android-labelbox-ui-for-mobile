import React from 'react';

export default function GenericImage({ listingImage }) {
  return (
    <div className="additional-image">
      <div>Photo ID: {listingImage.photoId}</div>
      <img src={listingImage.photoLink} width="100%" />
    </div>
  );
}