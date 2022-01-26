import React from 'react';
import DefaultImage from './DefaultImage';

export default function PhotoGridWithHeader({
  assetData,
  gridImages,
  onClickImage,
  photoEdits,
  selectedListing = {},
  selectedImageIdx,
}) {
  if (!assetData) return null;

  return (
    <>
      <div className="header sticky">
        <div className="listing-title">
          <h3>
            {assetData.attribute} - {assetData.qualityTier}
          </h3>

          <div className="listing-header">
            <div className="listing-info">
              Listing ID: {selectedListing.listingId}
            </div>
            <div className="listing-info">
              Photo ID: {selectedListing.photoId}
            </div>
            <div className="listing-info">
              Property type: {selectedListing.propertyType}
            </div>
            <div className="listing-info">
              Room type: {selectedListing.roomType}
            </div>
            <div className="listing-info">
              <a
                href={`https://www.airbnb.com/rooms/${selectedListing.listingId}`}
                id="selected-pdp-link"
                target="_blank"
              >
                Link to PDP
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="photo-grid">
        {gridImages.map((imgObj, idx) => {
          const isEdited = photoEdits.find(
            (edit) => edit.listingId === imgObj.listingId
          );
          return (
            <DefaultImage
              imgObj={imgObj}
              idx={idx}
              isEdited={isEdited}
              isSelected={selectedImageIdx === idx}
              key={imgObj.photoId}
              onClickImage={(photoIdx) => onClickImage(photoIdx)}
            />
          );
        })}
      </div>
    </>
  );
}
