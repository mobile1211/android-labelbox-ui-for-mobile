import React, { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import Content from './Content';
import GenericImage from './GenericImage';

function PanelInfo({
  title, 
  description, 
  location, 
  where, 
  lat, 
  lng,
}) {
  useEffect(() => {
    document.querySelector("div.flex-column.side-panel").scrollTo(0,0);
  }, [lat, lng])
  
  // https://www.google.com/maps/search/?api=1&query={lat}%2C{lng}
  // src="https://maps.google.com/maps?q=${lat},${lng}&hl=es&z=14&amp;output=embed"
  // href="https://maps.google.com/maps?q=${lat},${lng};z=14&amp;output=embed"
  return (
    <>
    <div className='listing-info-container'>
      <div className="listing-info">
        <b>Title</b>: {title}
      </div>
    </div>

    <div className='listing-info-container'>
      <div className="listing-info">
        <b>Description</b>: {description}
      </div>
    </div>

    <div className='listing-info-container'>
      <div className="listing-info">
        <b>Location</b>: {location}
      </div>
    </div>

    <div className='listing-info-container'>
      <div className="listing-info">
        <b>Where You'll Be</b>: {where}
      </div>
    </div>

    <div className='listing-info-container'>
      <div className="listing-info">
        <iframe width="450" height="450" frameBorder="0" scrolling="yes" marginHeight="0" marginWidth="0"
          src={`https://maps.google.com/maps?q=${lat},${lng}&z=14&output=embed`}
        >
        </iframe>
      </div>
    </div>
    </>
  );
}

// Utils
function get(url){
  var Httpreq = new XMLHttpRequest();
  Httpreq.open("GET", url, false);
  Httpreq.send(null);
  return Httpreq.responseText;
}

// Root app
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
})

// fetch asset on componentDidMount
useEffect(() => {
  setIsLoading(true);
  Labelbox.currentAsset().subscribe(asset => {
    handleAssetChange(asset);
  });
})

  return (
    <>
      <div className="flex-grow flex-column">
        <Header 
          currentAsset={currentAsset}
          hasNext={
            Boolean((currentAsset && currentAsset.next) || 
            (currentAsset && currentAsset.label))
          }
          hasPrev={currentAsset?.previous} 
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
      <div className="flex-column side-panel">
        <h5>Listing Info</h5>
        {
          selectedListing ? (
            <PanelInfo 
              title={selectedListing.listingTitle}
              description={selectedListing.listingDescription}
              location={selectedListing.listingLocation}
              where={selectedListing.listingNeighborhood} 
              lat={selectedListing.lat}
              lng={selectedListing.lng}
            />
          ) : null
        }
        <h5>Other pictures</h5>
        {
          selectedListing ? 
            selectedListing.listingImages.map((image) => (
              <GenericImage key={image.photoId} listingImage={image} />
            )) : null
        }
      </div>
    </>
  );
}
