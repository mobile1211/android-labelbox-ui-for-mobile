const { useEffect, useState, useCallback } = React;

const DEFAULT_CONFIG = {
  classifications: [
    {
      name: "image_grid_update",
      instructions: "Done updating image grid?",
      type: "radio",
      options: [
        {
          "label": "Yes",
          "value": "yes"
        },
        {
          "label": "No",
          "value": "no"
        }
      ]
    }
  ]
};

// Components
// Cannot split into separate files / modules unless we add webpack config
// https://stackoverflow.com/questions/36698354/require-is-not-defined
function Header({ currentAsset, hasPrev, hasNext, projectId }) {
  const handleGoHome = useCallback(() => {
    window.location.href =
    "https://app.labelbox.com/projects/" + projectId;
  }, []);

  const handleGoBack = useCallback(() => {
    safelyClearSelectedMetadata();
    showLoadingAssets();
    if (currentAsset.previous) {
        Labelbox.setLabelAsCurrentAsset(currentAsset.previous);
    }
  })

  const handleGoNext = useCallback(() => {
    safelyClearSelectedMetadata();
    showLoadingAssets();
    if (currentAsset.next) {
      Labelbox.setLabelAsCurrentAsset(currentAsset.next);
    } else {
      Labelbox.fetchNextAssetToLabel();
    }
  }, [])

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

function Image({ assetData, imgObj, idx }) {
  const photoLink = imgObj.photoLink?.includes("?")
    ? `${imgObj.photoLink}`
    : `${imgObj.photoLink}?img_w=720`;
  const listingId = imgObj.listingId;

  const displayInfo = useCallback((idx) => {
    console.log("Image state:", assetData.gridImages[idx]);
    const {
      listingId,
      photoId,
      propertyType,
      roomType,
      listingImages,
      listingTitle: title,
      listingDescription: description,
      listingLocation: location,
      listingNeighborhood: neighborhood,
      lat,
      lng,
    } = assetData.gridImages[idx];
  
    clearSelectedMetadata();
  
    document.querySelector(`#image-container-${listingId}`).classList.add('selected');
    document.querySelector("#selected-id").innerHTML = listingId;
    document.querySelector("#selected-photo").innerHTML = photoId;
    document.querySelector("#selected-pdp-link").href = pdpUrl(listingId);
    document.querySelector("#selected-property-type").innerHTML = propertyType;
    document.querySelector("#selected-room-type").innerHTML = roomType;
    document.querySelector("div.flex-column.side-panel").scrollTo(0,0);
    document.querySelector("#panel-info").innerHTML = createPanelInfo(title, description, location, neighborhood, lat, lng);
    document.querySelector("#panel-pictures").innerHTML = listingImages.map(createAdditionalImage).join("\n");
  }, [])

  return (
    <div
      className="image-container"
      onClick={() => displayInfo(idx)}
      tabIndex={idx}
      id={`image-container-${listingId}`}
    >
      <img src={photoLink} listingId={listingId} className="image" />
    </div>
  );
}

function PhotoGridWithHeader({ assetData }) {
  if (!assetData) return null;

  return (
    <>
      <div className="header sticky">
        <div className="listing-title">
          <h3>{assetData.attribute} - {assetData.qualityTier}</h3>

          <div className='listing-header'>
            <div className="listing-info">
              Listing ID: <span id="selected-id"></span>
            </div>
            <div className="listing-info">
              Photo ID: <span id="selected-photo"></span>
            </div>
            <div className="listing-info">
              Property type: <span id="selected-property-type"></span>
            </div>
            <div className="listing-info">
              Room type: <span id="selected-room-type"></span>
            </div>
            <div className="listing-info">
              <a href="" id="selected-pdp-link" target="_blank">Link to PDP</a>
            </div>
          </div>
        </div>
      </div>

      <div className="photo-grid">
        {assetData.gridImages.map((imgObj, idx) => 
          <Image assetData={assetData} imgObj={imgObj} idx={idx} key={imgObj.photoId} />
        )}
      </div>
    </>
  );
}

function Content({ assetData, currentAsset, isLoading }) {
  const handleSkip = useCallback(() => {
    safelyClearSelectedMetadata();
    showLoadingAssets();
    Labelbox.skip().then(() => {
      Labelbox.fetchNextAssetToLabel();
    });
  }, []);

  const handleSubmit = useCallback(() => {
      safelyClearSelectedMetadata();
  
      const label = JSON.stringify(getLabel());
      const jumpToNext = Boolean(!currentAsset.label);
      console.log("jumpToNext:", jumpToNext)
      // Progress if this asset is new
      if (jumpToNext) {
          showLoadingAssets();
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
        {isLoading ? 'loading...' : <PhotoGridWithHeader assetData={assetData} />}
      </div>
      <div className="flex-column questions">
        <div id="questions" />
        <div className="flex-grow" />
        <div 
          style={{ display: 'flex' }}
        >
          <a
          className="waves-effect waves-light btn-large"
          style={{ 
            backgroundColor: 'white', 
            color: 'black', width: '100%', 
            marginRight: '10px' 
          }}
          onClick={handleSkip}
          >
            Skip
          </a>
          <a
          className="waves-effect waves-light btn-large"
          style={{ 
            backgroundColor: '#03a9f4', 
            width: '100%' 
          }}
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

let classifications = [];

function drawQuestions(answers) {
  document.querySelector("#questions").innerHTML = classifications
    .map(classification => createQuestion(classification, answers))
    .join("");
}

Labelbox.getTemplateCustomization().subscribe(customization => {
  classifications =
    (customization && customization.classifications) || defaultConfiguration.classifications;
  drawQuestions(classifications);
});

// Root app
function App() {
  const projectId = new URL(window.location.href).searchParams.get("project");
  const [isLoading, setIsLoading] = useState(false);
  const [currentAsset, setCurrentAsset] = useState();
  const [assetData, setAssetData] = useState();


function handleAssetChange(asset) {
  // console.log("Asset", asset);
  // console.log("S3 asset link", asset.data);
  if (asset) {
    const assetDataStr = get(asset.data).replace(/NaN/g, "null");
    const parsedAssetData = JSON.parse(assetDataStr);
    if ((currentAsset && currentAsset.id) !== asset.id) {
      if (asset.label) {
        try {
          const label = JSON.parse(asset.label);
          drawQuestions(label);
        } catch (e) {
          console.log("failed to read label", e);
        }
      } else {
        drawQuestions();
      }
      setCurrentAsset(asset);
      setAssetData(parsedAssetData);
    }
    setIsLoading(false);
  }
}

//  fetch asset on componentDidMount
useEffect(() => {
  setIsLoading(true);
  Labelbox.currentAsset().subscribe(asset => {
    handleAssetChange(asset);
  });
})

  return (
    <>
      <Header 
        currentAsset={currentAsset}
        hasNext={
          Boolean((currentAsset && currentAsset.next) || 
          (currentAsset && currentAsset.label))
        }
        hasPrev={currentAsset?.previous} 
        projectId={projectId}
      />
      <Content 
        assetData={assetData}
        currentAsset={currentAsset}
        isLoading={isLoading}
      />
    </>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));