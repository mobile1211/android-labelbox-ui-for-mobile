import React, { useState } from 'react';

export default function LeftPanel({
  assetData,
  selectedListing,
  selectedImageIdx,
  updatedPhotoId,
}) {
  const [photoQualityTier, setPhotoQualityTier] = useState(
    assetData.qualityTier
  );

  function handlePhotoQualityChange(e) {
    setPhotoQualityTier(e.target.value);
  }

  function handleRevertChanges() {}

  return (
    <div className="flex-column left-side-panel">
      <button onClick={handleRevertChanges}>
        <i className="material-icons margin-bottom">close</i>
      </button>
      <div className="margin-bottom">
        Selected photo id:{' '}
        {selectedListing.listingImages[selectedImageIdx].photoId}
      </div>
      <form>
        <label>
          New photo id:
          <input type="text" name="photo-id" value={updatedPhotoId} />
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
        <button>
          <input type="submit" value="Save" />
        </button>
      </form>
    </div>
  );
}
