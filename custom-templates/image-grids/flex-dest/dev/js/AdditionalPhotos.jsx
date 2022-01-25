import React, { useState } from 'react';
import GenericImage from './GenericImage';

export default function AdditionalPhotos({ selectedListing, onClickImage }) {
  const [selectedPhotoId, setSelectedPhotoId] = useState();

  if (!selectedListing) return null;
  return (
    <>
      <h5>Other pictures</h5>
      {selectedListing.listingImages.map((image) => (
        <GenericImage
          key={image.photoId}
          isSelected={selectedPhotoId === image.photoId}
          listingImage={image}
          onClick={onClickImage}
        />
      ))}
    </>
  );
}
