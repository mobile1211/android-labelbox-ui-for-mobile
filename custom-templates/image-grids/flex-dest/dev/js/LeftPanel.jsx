import React, { useState } from 'react';

export default function LeftPanel({
  assetData,
  newPhotoId,
  selectedListing,
  selectedImageIdx,
  setDefaultPhotoId,
}) {
  const [photoQualityTier, setPhotoQualityTier] = useState(
    assetData.qualityTier
  );

  function handlePhotoQualityChange(e) {
    setPhotoQualityTier(e.target.value);
  }

  function handleRevertChanges() {
    setDefaultPhotoId('');
    setPhotoQualityTier(assetData.qualityTier);
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log('newPhotoId', newPhotoId, 'photoQualityTier', photoQualityTier);
  }

  return (
    <div className="flex-column left-side-panel">
      <button className="margin-bottom" onClick={handleRevertChanges}>
        <i className="material-icons">close</i>
      </button>
      <div className="margin-bottom">
        Selected photo id:{' '}
        {selectedListing.listingImages[selectedImageIdx].photoId}
      </div>
      <form onSubmit={handleSubmit}>
        <label>
          New photo id:
          <input type="text" name="photo-id" readOnly value={newPhotoId} />
        </label>
        <label>
          New photo quality:
          <select value={photoQualityTier} onChange={handlePhotoQualityChange}>
            <option value="Most Inspiring">Most Inspiring</option>
            <option value="High">High</option>
            <option value="Acceptable">Acceptable</option>
            <option value="Low Quality">Low Quality</option>
            <option value="Unacceptable">Unacceptable</option>
          </select>
        </label>
        <input className="save-cta" type="submit" value="Save" />
      </form>
    </div>
  );
}
