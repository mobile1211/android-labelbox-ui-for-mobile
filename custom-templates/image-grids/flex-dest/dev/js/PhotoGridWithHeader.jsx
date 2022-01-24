import React from 'react';
import DefaultImage from './DefaultImage';

export default function PhotoGridWithHeader({ 
  assetData, 
  onClickImage, 
  selectedListing = {}, 
  selectedImageIdx 
}) {
  if (!assetData) return null;

  return (
    <>
      <div className="header sticky">
        <div className="listing-title">
          <h3>{assetData.attribute} - {assetData.qualityTier}</h3>

          <div className='listing-header'>
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
              <a href={`https://www.airbnb.com/rooms/${selectedListing.listingId}`} id="selected-pdp-link" target="_blank">Link to PDP</a>
            </div>
          </div>
        </div>
      </div>

      <div className="photo-grid">
        {assetData.gridImages.map((imgObj, idx) => 
          <DefaultImage 
            imgObj={imgObj} 
            idx={idx} 
            key={imgObj.photoId}
            isSelected={selectedImageIdx === idx}
            onClickImage={(photoIdx) => onClickImage(photoIdx)}
          />
        )}
      </div>
    </>
  );
}