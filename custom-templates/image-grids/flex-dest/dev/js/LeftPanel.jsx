import React from 'react';

export default function LeftPanel({
  assetData,
  selectedListing,
  selectedImageIdx,
}) {
  return (
    <div className="flex-column left-side-panel">
      Selected photo id:{' '}
      {selectedListing.listingImages[selectedImageIdx].photoId}
      <form>
        <label>
          New photo id:
          <input type="text" name="photo-id"></input>
        </label>
        <label>
          New photo quality:
          <select value={assetData.qualityTier} onChange={() => {}}>
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
