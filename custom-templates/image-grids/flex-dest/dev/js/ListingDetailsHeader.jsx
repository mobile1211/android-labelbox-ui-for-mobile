import React from 'react';
import getUpdatedDefaultPhotoId from './getUpdatedDefaultPhotoId';

export default function ListingDetailsHeader({
  attribute,
  photoEdits,
  qualityTier,
  selectedListing = {},
}) {
  const originalDefaultPhotoId = selectedListing.photoId;
  const updatedDefaultPhotoId = getUpdatedDefaultPhotoId(
    photoEdits,
    selectedListing
  );

  return (
    <div className="header sticky">
      <div className="listing-title">
        <h3>
          {attribute} - {qualityTier}
        </h3>

        <div className="listing-header">
          <div className="listing-info">
            Listing ID: {selectedListing.listingId}
          </div>
          <div className="listing-info">
            Photo ID: {updatedDefaultPhotoId || originalDefaultPhotoId}
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
              PDP Link
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
