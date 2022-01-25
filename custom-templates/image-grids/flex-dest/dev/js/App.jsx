import React, { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import Content from './Content';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import { get } from './utils';
import AdditionalPhotos from './AdditionalPhotos';

export default function App() {
  const projectId = new URL(window.location.href).searchParams.get('project');
  const [isLoading, setIsLoading] = useState(false);
  const [currentAsset, setCurrentAsset] = useState();
  const [assetData, setAssetData] = useState();
  const [selectedListing, setSelectedListing] = useState();
  const [selectedImageIdx, setSelectedImageIdx] = useState();
  const [, setSelectedListingDefaultPhotoId] = useState();

  function handleAssetChange(asset) {
    if (asset) {
      const assetDataStr = get(asset.data).replace(/NaN/g, 'null');
      const parsedAssetData = JSON.parse(assetDataStr);
      if (currentAsset?.id !== asset.id) {
        setCurrentAsset(asset);
        setAssetData(parsedAssetData);
      }
      setIsLoading(false);
    }
  }

  const onClickImage = useCallback((imageIdx) => {
    setSelectedImageIdx(imageIdx);
    setSelectedListing(assetData.gridImages[imageIdx]);
  });

  function handleClickAdditionalImage(photoId) {
    setSelectedListingDefaultPhotoId(photoId);
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
      {selectedListing ? (
        <LeftPanel
          assetData={assetData}
          selectedImageIdx={selectedImageIdx}
          selectedListing={selectedListing}
        />
      ) : null}
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
          currentAsset={currentAsset}
          isLoading={isLoading}
          onClickImage={onClickImage}
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
        />
      </div>
    </>
  );
}
