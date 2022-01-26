import React, { useState } from 'react';
import usePhotoEdits from './usePhotoEdits';

export default function LeftPanel({
  assetData,
  newPhotoId,
  selectedListing,
  setDefaultPhotoId,
}) {
  const [photoQualityTier, setPhotoQualityTier] = useState(
    assetData.qualityTier
  );
  const originalDefaultPhotoId = selectedListing.photoId;
  const { setPhotoEdits } = usePhotoEdits();

  function handlePhotoQualityChange(e) {
    setPhotoQualityTier(e.target.value);
  }

  function handleRevertChanges() {
    setDefaultPhotoId('');
    setPhotoQualityTier(assetData.qualityTier);
  }

  function handleSubmit(e) {
    e.preventDefault();
    // change default photo id in edits
    if (!!newPhotoId && newPhotoId !== originalDefaultPhotoId) {
      setPhotoEdits((prevEdits) => {
        const prevChangeIndex = prevEdits.findIndex(
          (edit) => edit.listingId === selectedListing.listingId
        );

        console.log('prevEdits default photo', prevEdits, prevChangeIndex);

        if (prevChangeIndex !== -1) {
          return [
            ...prevEdits.slice(0, prevChangeIndex),
            Object.assign({}, prevEdits[prevChangeIndex], {
              updatedDefaultPhotoId: newPhotoId,
            }),
            ...prevEdits.slice(prevChangeIndex + 1),
          ];
        } else {
          return [
            ...prevEdits,
            {
              listingId: selectedListing.listingId,
              updatedDefaultPhotoId: newPhotoId,
              updatedPhotoQuality: photoQualityTier,
            },
          ];
        }
      });
    }

    // change photo quality tier in edits
    if (photoQualityTier !== assetData.qualityTier) {
      setPhotoEdits((prevEdits) => {
        const prevChangeIndex = prevEdits.findIndex(
          (edit) => edit.listingId === selectedListing.listingId
        );
        console.log('prevEdits quality', prevEdits, prevChangeIndex);

        if (prevChangeIndex !== -1) {
          return [
            ...prevEdits.slice(0, prevChangeIndex),
            Object.assign({}, prevEdits[prevChangeIndex], {
              updatedPhotoQuality: photoQualityTier,
            }),
            ...prevEdits.slice(prevChangeIndex + 1),
          ];
        } else {
          return [
            ...prevEdits,
            {
              listingId: selectedListing.listingId,
              updatedPhotoQuality: photoQualityTier,
            },
          ];
        }
      });
    }
  }

  return (
    <div className="flex-column left-side-panel">
      <button className="margin-bottom" onClick={handleRevertChanges}>
        <i className="material-icons">close</i>
      </button>
      <div className="margin-bottom">
        Selected photo id: {originalDefaultPhotoId}
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
