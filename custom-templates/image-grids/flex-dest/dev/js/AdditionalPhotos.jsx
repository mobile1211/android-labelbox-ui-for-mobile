import React from 'react';
import AdditionalImage from './AdditionalImage';

export default function AdditionalPhotos({
  selectedListing,
  onClickImage,
  newDefaultPhotoId,
}) {
  if (!selectedListing) return null;

  return (
    <>
      <h5>Other pictures</h5>
      {selectedListing.listingImages.map((image) => (
        <AdditionalImage
          key={image.photoId}
          isSelected={newDefaultPhotoId === image.photoId}
          listingImage={image}
          onClick={onClickImage}
        />
      ))}
    </>
  );
}
