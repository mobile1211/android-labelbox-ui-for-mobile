import React, { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import Content from './Content';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import { get } from './utils';
import AdditionalPhotos from './AdditionalPhotos';
import getEffectiveGridImages from './getEffectiveGridImages';

export default function App() {
  const projectId = new URL(window.location.href).searchParams.get('project');
  const [isLoading, setIsLoading] = useState(false);
  const [currentAsset, setCurrentAsset] = useState();
  const [assetData, setAssetData] = useState();
  const [selectedListing, setSelectedListing] = useState();
  const [selectedImageIdx, setSelectedImageIdx] = useState();
  const [newDefaultPhotoId, setNewDefaultPhotoId] = useState('');

  // photoEdits data structure
  // [{
  //   listingId: 123,
  //   updatedDefaultPhotoId: 345,
  //   updatedPhotoQuality: 'High',
  // }]
  const [photoEdits, setPhotoEdits] = useState([]);

  const effectiveGridImages = getEffectiveGridImages(
    assetData,
    photoEdits,
    selectedImageIdx,
    newDefaultPhotoId
  );

  function handleAssetChange(asset) {
    if (asset) {
      const assetDataStr = get(asset.data).replace(/NaN/g, 'null');
      const parsedAssetData = JSON.parse(assetDataStr);

      if (asset.label) {
        const label = JSON.parse(asset.label);
        console.log('label', label);
      }

      if (currentAsset?.id !== asset.id) {
        setCurrentAsset(asset);
        setAssetData(parsedAssetData);
      }
      setIsLoading(false);
    }
  }

  const handleClickDefaultImage = useCallback((imageIdx) => {
    setSelectedImageIdx(imageIdx);
    setSelectedListing(assetData.gridImages[imageIdx]);
    setNewDefaultPhotoId('');
  });

  function handleClickAdditionalImage(photoId) {
    setNewDefaultPhotoId(photoId);
  }

  // fetch asset on componentDidMount
  useEffect(() => {
    setIsLoading(true);
    Labelbox.currentAsset().subscribe((asset) => {
      handleAssetChange(asset);
    });
  });

  return (
    <>
      <div className="flex-column left-side-panel">
        {selectedListing ? (
          <LeftPanel
            assetData={assetData}
            newPhotoId={newDefaultPhotoId}
            photoEdits={photoEdits}
            selectedListing={selectedListing}
            setNewDefaultPhotoId={setNewDefaultPhotoId}
            setPhotoEdits={setPhotoEdits}
          />
        ) : null}
      </div>
      <div className="flex-grow flex-column">
        <Header
          currentAsset={currentAsset}
          hasNext={!!currentAsset?.next || !!currentAsset?.label}
          hasPrev={!!currentAsset?.previous}
          projectId={projectId}
          setIsLoading={setIsLoading}
          setSelectedListing={setSelectedListing}
          setSelectedImageIdx={setSelectedImageIdx}
        />
        <Content
          assetData={assetData}
          gridImages={effectiveGridImages}
          isLoading={isLoading}
          onClickImage={handleClickDefaultImage}
          photoEdits={photoEdits}
          selectedListing={selectedListing}
          selectedImageIdx={selectedImageIdx}
          setSelectedListing={setSelectedListing}
          setSelectedImageIdx={setSelectedImageIdx}
          setIsLoading={setIsLoading}
        />
      </div>
      <div className="flex-column right-side-panel">
        <RightPanel selectedListing={selectedListing} />
        <AdditionalPhotos
          selectedListing={selectedListing}
          onClickImage={handleClickAdditionalImage}
          newDefaultPhotoId={newDefaultPhotoId}
        />
      </div>
    </>
  );
}
