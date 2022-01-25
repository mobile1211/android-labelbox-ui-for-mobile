import React, { useState, useEffect, useCallback } from "react";
import Header from "./Header";
import Content from "./Content";
import GenericImage from "./GenericImage";
import RightPanelInfo from "./RightPanelInfo";
import { get } from "./utils";

export default function App() {
  const projectId = new URL(window.location.href).searchParams.get("project");
  const [isLoading, setIsLoading] = useState(false);
  const [currentAsset, setCurrentAsset] = useState();
  const [assetData, setAssetData] = useState();
  const [selectedListing, setSelectedListing] = useState();
  const [selectedImageIdx, setSelectedImageIdx] = useState();

  function handleAssetChange(asset) {
    // console.log("Asset", asset);
    // console.log("S3 asset link", asset.data);
    if (asset) {
      const assetDataStr = get(asset.data).replace(/NaN/g, "null");
      const parsedAssetData = JSON.parse(assetDataStr);
      if ((currentAsset && currentAsset.id) !== asset.id) {
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
        <div className="flex-column left-side-panel">
          <h5>
            Selected photo id:{" "}
            {selectedListing.listingImages[selectedImageIdx].photoId}
          </h5>
        </div>
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
        <h5>Listing Info</h5>
        {selectedListing ? (
          <RightPanelInfo
            title={selectedListing.listingTitle}
            description={selectedListing.listingDescription}
            location={selectedListing.listingLocation}
            where={selectedListing.listingNeighborhood}
            lat={selectedListing.lat}
            lng={selectedListing.lng}
          />
        ) : null}
        <h5>Other pictures</h5>
        {selectedListing
          ? selectedListing.listingImages.map((image) => (
              <GenericImage
                key={image.photoId}
                listingImage={image}
                onClickImage={() => {}}
              />
            ))
          : null}
      </div>
    </>
  );
}
