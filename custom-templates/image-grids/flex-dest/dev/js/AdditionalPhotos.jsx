import React from 'react';
import GenericImage from './GenericImage';

export default function AdditionalPhotos({ selectedListing, onClickImage }) {
  if (!selectedListing) return null;
  return (
    <>
      <h5>Other pictures</h5>
      {selectedListing.listingImages.map((image) => (
        <GenericImage
          key={image.photoId}
          listingImage={image}
          onClickImage={onClickImage}
        />
      ))}
    </>
  );
}
