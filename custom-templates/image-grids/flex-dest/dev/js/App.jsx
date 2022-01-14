const { useEffect, useState, useCallback } = React;

// Components
// Cannot split into separate files / modules unless we add webpack config
// https://stackoverflow.com/questions/36698354/require-is-not-defined
function Header({ 
  currentAsset, 
  hasPrev, 
  hasNext, 
  projectId, 
  setIsLoading, 
  setSelectedListing,
  setSelectedImageIdx,
}) {
  const handleGoHome = useCallback(() => {
    window.location.href =
    "https://app.labelbox.com/projects/" + projectId;
  }, [projectId]);

  const handleGoBack = useCallback(() => {
    setSelectedListing();
    setSelectedImageIdx();
    setIsLoading(true);

    if (currentAsset.previous) {
      Labelbox.setLabelAsCurrentAsset(currentAsset.previous);
    }
  }, [currentAsset])

  const handleGoNext = useCallback(() => {
    setSelectedListing();
    setSelectedImageIdx();
    setIsLoading(true);

    if (currentAsset.next) {
      Labelbox.setLabelAsCurrentAsset(currentAsset.next);
    } else {
      Labelbox.fetchNextAssetToLabel();
    }
  }, [currentAsset])

  return (
    <div className="header-container">
      <i
      className="material-icons home-icon"
      onClick={handleGoHome}
      >
        home
      </i>
      <i
      id="back"
      className={`material-icons back-icon ${hasPrev ? 'button-default': ''}`}
      onClick={handleGoBack}
      >
        keyboard_arrow_left
      </i>
      <div 
        className="header-title"
        id="externalid"
      >
        Label this asset
      </div>
      <i
      id="next"
      className={`material-icons next-icon ${hasNext ? 'button-default': ''}`}
      onClick={handleGoNext}
      >
        keyboard_arrow_right
      </i>
    </div>
  );
}

function DefaultImage({ imgObj, idx, isSelected, onClickImage }) {
  const photoLink = imgObj.photoLink?.includes("?")
    ? `${imgObj.photoLink}`
    : `${imgObj.photoLink}?img_w=720`;
  const listingId = imgObj.listingId;

  return (
    <div
      className="image-container"
      onClick={() => onClickImage(idx)}
      tabIndex={idx}
      id={`image-container-${listingId}`}
    >
      <img src={photoLink} className={`image ${isSelected ? 'image-selected' : ''}`} />
    </div>
  );
}

function GenericImage({ listingImage }) {
  return (
    <div className="additional-image">
      <div>Photo ID: {listingImage.photoId}</div>
      <img src={listingImage.photoLink} width="100%" />
    </div>
  );
}

function PhotoGridWithHeader({ 
  assetData, 
  onClickImage, 
  selectedListing = {}, 
  selectedImageIdx 
}) {
  if (!assetData) return null;

  return (
    <>
      <div className="header sticky">
        <div className="listing-title">
          <h3>{assetData.attribute} - {assetData.qualityTier}</h3>

          <div className='listing-header'>
            <div className="listing-info">
              Listing ID: {selectedListing.listingId}
            </div>
            <div className="listing-info">
              Photo ID: {selectedListing.photoId}
            </div>
            <div className="listing-info">
              Property type: {selectedListing.propertyType}
            </div>
            <div className="listing-info">
              Room type: {selectedListing.roomType}
            </div>
            <div className="listing-info">
              <a href={`https://www.airbnb.com/rooms/${selectedListing.listingId}`} id="selected-pdp-link" target="_blank">Link to PDP</a>
            </div>
          </div>
        </div>
      </div>

      <div className="photo-grid">
        {assetData.gridImages.map((imgObj, idx) => 
          <DefaultImage 
            imgObj={imgObj} 
            idx={idx} 
            key={imgObj.photoId}
            isSelected={selectedImageIdx === idx}
            onClickImage={(photoIdx) => onClickImage(photoIdx)}
          />
        )}
      </div>
    </>
  );
}

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


function Content({ 
  assetData, 
  currentAsset, 
  isLoading, 
  onClickImage, 
  selectedListing, 
  selectedImageIdx,
  setIsLoading,
  setSelectedListing,
  setSelectedImageIdx,
}) {
  const handleSkip = useCallback(() => {
    setSelectedListing();
    setSelectedImageIdx();
    setIsLoading(true);
    Labelbox.skip().then(() => {
      Labelbox.fetchNextAssetToLabel();
    });
  }, []);

  const handleSubmit = useCallback(() => {
      setSelectedListing();
      setSelectedImageIdx();

      console.log('getLabel', getLabel())

      const label = JSON.stringify(getLabel());
      const jumpToNext = Boolean(!currentAsset.label);
      console.log("jumpToNext:", jumpToNext)
      // Progress if this asset is new
      if (jumpToNext) {
        setIsLoading(true);
      }
      Labelbox.setLabelForAsset(label, 'ANY').then(() => {
          if (jumpToNext) {
          Labelbox.fetchNextAssetToLabel();
          }
      });
  }, []);

  return (
    <div className="content">
      <div id="asset">
        {isLoading ? 'loading...' : (
          <PhotoGridWithHeader 
            assetData={assetData} 
            onClickImage={onClickImage} 
            selectedListing={selectedListing}
            selectedImageIdx={selectedImageIdx}
          />
          )
        }
      </div>
      <div className="flex-column questions">
        <div id="questions" />
        <div className="flex-grow" />
        <div 
          style={{ display: 'flex' }}
        >
          <a
          className="waves-effect waves-light btn-large skip-button"
          onClick={handleSkip}
          >
            Skip
          </a>
          <a
          className="waves-effect waves-light btn-large submit-button"
          onClick={handleSubmit}
          >
            Submit
          </a>
        </div>
      </div>
    </div>
  )
}

// Utils
function get(url){
  var Httpreq = new XMLHttpRequest();
  Httpreq.open("GET", url, false);
  Httpreq.send(null);
  return Httpreq.responseText;
}

// Root app
function App() {
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

//  fetch asset on componentDidMount
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

ReactDOM.render(<App />, document.getElementById('root'));