import React, { useState } from 'react';
import getUpdatedDefaultPhotoId from './getUpdatedDefaultPhotoId';

export default function LeftPanel({
  assetData,
  newPhotoId,
  photoEdits,
  selectedListing,
  setNewDefaultPhotoId,
  setPhotoEdits,
}) {
  const [photoQualityTier, setPhotoQualityTier] = useState(
    assetData.qualityTier
  );
  const originalDefaultPhotoId = selectedListing.photoId;
  const updatedDefaultPhotoId = getUpdatedDefaultPhotoId(
    photoEdits,
    selectedListing
  );

  function handlePhotoQualityChange(e) {
    setPhotoQualityTier(e.target.value);
  }

  function handleRevertChanges() {
    setNewDefaultPhotoId('');
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

    handleRevertChanges();
  }

  return (
    <>
      <div className="margin-bottom">
        Original photo id: {originalDefaultPhotoId}
      </div>
      <div className="margin-bottom">
        Selected photo id: {updatedDefaultPhotoId || originalDefaultPhotoId}
      </div>
      <form onSubmit={handleSubmit}>
        <label>
          New photo id:
          <input type="text" name="photo-id" readOnly value={newPhotoId} />
        </label>
        <label>
          <div className="label">New photo quality:</div>
          <select value={photoQualityTier} onChange={handlePhotoQualityChange}>
            <option value="Most Inspiring">Most Inspiring</option>
            <option value="High">High</option>
            <option value="Acceptable">Acceptable</option>
            <option value="Low Quality">Low Quality</option>
            <option value="Unacceptable">Unacceptable</option>
          </select>
        </label>
        <div className="left-panel-ctas-wrapper">
          <button onClick={handleRevertChanges} className="cta clear-cta">
            Clear
          </button>
          <input className="cta save-cta" type="submit" value="Save" />
        </div>
      </form>
    </>
  );
}
