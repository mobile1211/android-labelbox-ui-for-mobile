import React, { useEffect, useState } from 'react';
import getUpdatedDefaultPhotoInfo from './getUpdatedDefaultPhotoInfo';

export default function LeftPanel({
  assetData,
  newDefaultPhotoId,
  photoEdits,
  selectedListing,
  setNewDefaultPhotoId,
  setPhotoEdits,
}) {
  const originalPhotoQualityTier = assetData.qualityTier;
  const originalDefaultPhotoId = selectedListing.photoId;

  const updatedDefaultPhotoInfo = getUpdatedDefaultPhotoInfo(
    photoEdits,
    selectedListing
  );
  const updatedDefaultPhotoId = updatedDefaultPhotoInfo?.defaultPhotoId;
  const updatedDefaultPhotoQualityTier =
    updatedDefaultPhotoInfo?.photoQualityTier;

  const [photoQualityTier, setPhotoQualityTier] = useState(
    updatedDefaultPhotoQualityTier || originalPhotoQualityTier
  );

  useEffect(() => {
    setPhotoQualityTier(
      updatedDefaultPhotoQualityTier || originalPhotoQualityTier
    );
  }, [selectedListing]);

  function handlePhotoQualityChange(e) {
    setPhotoQualityTier(e.target.value);
  }

  function clearUnsavedChanges() {
    setNewDefaultPhotoId('');
    setPhotoQualityTier(assetData.qualityTier);
  }

  function handleResetChanges() {
    clearUnsavedChanges();

    // delete saved change entry from photoEdits
    setPhotoEdits((prevEdits) => {
      const prevChangeIndex = prevEdits.findIndex(
        (edit) => edit.listingId === selectedListing.listingId
      );

      if (prevChangeIndex !== -1) {
        return [
          ...prevEdits.slice(0, prevChangeIndex),
          ...prevEdits.slice(prevChangeIndex + 1),
        ];
      } else {
        return prevEdits;
      }
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!!newDefaultPhotoId) {
      // photo id and quality tier both same as original data
      if (
        newDefaultPhotoId === originalDefaultPhotoId &&
        photoQualityTier === assetData.qualityTier
      ) {
        setPhotoEdits((prevEdits) => {
          const prevChangeIndex = prevEdits.findIndex(
            (edit) => edit.listingId === selectedListing.listingId
          );

          if (prevChangeIndex !== -1) {
            // delete previous edit
            return [
              ...prevEdits.slice(0, prevChangeIndex),
              ...prevEdits.slice(prevChangeIndex + 1),
            ];
          }
          return prevEdits;
        });
      }

      if (newDefaultPhotoId !== originalDefaultPhotoId) {
        setPhotoEdits((prevEdits) => {
          const prevChangeIndex = prevEdits.findIndex(
            (edit) => edit.listingId === selectedListing.listingId
          );

          if (prevChangeIndex !== -1) {
            // override previous edit
            return [
              ...prevEdits.slice(0, prevChangeIndex),
              Object.assign({}, prevEdits[prevChangeIndex], {
                defaultPhotoId: newDefaultPhotoId,
              }),
              ...prevEdits.slice(prevChangeIndex + 1),
            ];
          } else {
            // add to photoEdits
            return [
              ...prevEdits,
              {
                listingId: selectedListing.listingId,
                defaultPhotoId: newDefaultPhotoId,
                photoQualityTier,
              },
            ];
          }
        });
      }
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
              photoQualityTier,
            }),
            ...prevEdits.slice(prevChangeIndex + 1),
          ];
        } else {
          return [
            ...prevEdits,
            {
              listingId: selectedListing.listingId,
              photoQualityTier,
            },
          ];
        }
      });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Photo id:
        <input
          type="text"
          name="photo-id"
          readOnly
          value={
            newDefaultPhotoId || updatedDefaultPhotoId || originalDefaultPhotoId
          }
        />
      </label>
      <label>
        <div className="label">Photo quality:</div>
        <select value={photoQualityTier} onChange={handlePhotoQualityChange}>
          <option value="Most Inspiring">Most Inspiring</option>
          <option value="High">High</option>
          <option value="Acceptable">Acceptable</option>
          <option value="Low Quality">Low Quality</option>
          <option value="Unacceptable">Unacceptable</option>
        </select>
      </label>
      <div className="left-panel-ctas-wrapper">
        <button onClick={handleResetChanges} className="cta clear-cta">
          Reset
        </button>
        <input className="cta save-cta" type="submit" value="Save" />
      </div>
    </form>
  );
}
