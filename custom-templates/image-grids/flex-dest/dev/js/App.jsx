import React, { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import Content from './Content';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import { get } from './utils';
import AdditionalPhotos from './AdditionalPhotos';
import getEffectiveGridImages from './getEffectiveGridImages';
import convertLabelToPhotoEditFormat from './convertLabelToPhotoEditFormat';

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
  //   defaultPhotoId: 345,
  //   photoQualityTier: 'High',
  // }]
  const [labels, setLabels] = useState([]);
  const [photoEdits, setPhotoEdits] = useState([]);

  const effectiveGridImages = getEffectiveGridImages(
    assetData,
    labels,
    photoEdits,
    selectedImageIdx,
    newDefaultPhotoId
  );

  const handleAssetChange = useCallback(
    (asset) => {
      if (asset) {
        const assetDataStr = get(asset.data).replace(/NaN/g, 'null');
        const parsedAssetData = JSON.parse(assetDataStr);

        if (asset.label) {
          if (asset.label === 'Skip') return;
          const labels = JSON.parse(asset.label);
          const formattedLabels = convertLabelToPhotoEditFormat(labels);

          setLabels(formattedLabels);
        }

        if (currentAsset?.id !== asset.id) {
          setCurrentAsset(asset);
          setAssetData(parsedAssetData);
        }
        setIsLoading(false);
      }
    },
    [currentAsset, setCurrentAsset, setAssetData, setIsLoading]
  );

  const handleClickDefaultImage = useCallback(
    (imageIdx) => {
      setSelectedImageIdx(imageIdx);
      setSelectedListing(assetData.gridImages[imageIdx]);
      setNewDefaultPhotoId('');
    },
    [assetData, setSelectedImageIdx, setSelectedListing, setNewDefaultPhotoId]
  );

  function handleClickAdditionalImage(photoId) {
    setNewDefaultPhotoId(photoId);
  }

  // fetch asset on componentDidMount
  useEffect(() => {
    setIsLoading(true);
    Labelbox.currentAsset().subscribe((asset) => {
      handleAssetChange(asset);
    });
  }, [handleAssetChange]);

  return (
    <>
      <div className="flex-column left-side-panel">
        {selectedListing ? (
          <LeftPanel
            assetData={assetData}
            newDefaultPhotoId={newDefaultPhotoId}
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
          labels={labels}
          photoEdits={photoEdits}
          selectedListing={selectedListing}
          selectedImageIdx={selectedImageIdx}
          setSelectedListing={setSelectedListing}
          setSelectedImageIdx={setSelectedImageIdx}
          setIsLoading={setIsLoading}
          setPhotoEdits={setPhotoEdits}
        />
      </div>
      <div className="flex-column right-side-panel">
        <RightPanel
          selectedListing={selectedListing}
          onClickImage={handleClickAdditionalImage}
          newDefaultPhotoId={newDefaultPhotoId}
        />
      </div>
    </>
  );
}
