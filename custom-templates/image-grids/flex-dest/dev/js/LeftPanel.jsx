import React, { useState } from 'react';

export default function LeftPanel({
  assetData,
  selectedListing,
  selectedImageIdx,
}) {
  const [photoQualityTier, setPhotoQualityTier] = useState(
    assetData.qualityTier
  );

  return (
    <div className="flex-column left-side-panel">
      <div className="margin-bottom">
        Selected photo id:{' '}
        {selectedListing.listingImages[selectedImageIdx].photoId}
      </div>
      <form>
        <label>
          New photo id:
          <input type="text" name="photo-id"></input>
        </label>
        <label>
          New photo quality:
          <select
            value={photoQualityTier}
            onChange={(val) => {
              setPhotoQualityTier(val);
            }}
          >
            <option value="Most Inspiring">Most Inspiring</option>
            <option value="High">High</option>
            <option value="Acceptable">Acceptable</option>
            <option value="Low Quality">Low Quality</option>
            <option value="Unacceptable">Unacceptable</option>
          </select>
        </label>
        <div>
          <input type="submit" value="Submit" />
        </div>
      </form>
    </div>
  );
}
