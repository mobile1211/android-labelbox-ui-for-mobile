// Components
// Cannot split into separate files / modules unless we add webpack config
// https://stackoverflow.com/questions/36698354/require-is-not-defined

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

function Header({ hasPrev, hasNext }) {
  const handleGoHome = useCallback(() => {
    window.location.href =
    "https://app.labelbox.com/projects/" + state.projectId;
  }, []);

  const handleGoBack = useCallback(() => {
    safelyClearSelectedMetadata();
    showLoadingAssets();
    if (state.currentAsset.previous) {
        Labelbox.setLabelAsCurrentAsset(state.currentAsset.previous);
    }
  })

  const handleGoNext = useCallback(() => {
    safelyClearSelectedMetadata();
    showLoadingAssets();
    if (state.currentAsset.next) {
      Labelbox.setLabelAsCurrentAsset(state.currentAsset.next);
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

function Content() {
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
      const jumpToNext = Boolean(!state.currentAsset.label);
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
        loading...
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

function drawAsset(asset, currentAsset, setCurrentAsset, setAssetS3Link) {
  console.log("Asset", asset);
  console.log("S3 asset link", asset.data);
  const assetDataStr = get(asset.data).replace(/NaN/g, "null");
  const assetData = JSON.parse(assetDataStr);
  if ((currentAsset && currentAsset.data) !== asset.data) {
    document.querySelector("#asset").innerHTML = getHtmlForAsset(assetData);
  }
  if ((currentAsset && currentAsset.id) !== asset.id) {
    if (asset.label) {
      try {
        const label = JSON.parse(asset.label);
        drawQuestions(classifications, label);
      } catch (e) {
        console.log("failed to read label", e);
      }
    } else {
      drawQuestions(classifications);
    }
  }
  setCurrentAsset(asset);
  setAssetS3Link(assetData);
}


// Root app
function App() {
  const projectId = new URL(window.location.href).searchParams.get("project");
  const [isLoading, setIsLoading] = useState(true);
  const [currentAsset, setCurrentAsset] = useState();
  const [assetS3Link, setAssetS3Link] = useState();

  let classifications = [];
  let markQuestionsAsLoaded;

//  fetch asset on componentDidMount
  useEffect(() => {
    new Promise(resolve => {
      markQuestionsAsLoaded = resolve;
    }).then(() => {
      Labelbox.currentAsset().subscribe(asset => {
        if (asset) {
          drawAsset(asset, currentAsset, setCurrentAsset, setAssetS3Link);
        }
      });
    });
  }, []);

  return (
    <>
      <Header 
        hasNext={
          Boolean((currentAsset && currentAsset.next) || 
          (currentAsset && currentAsset.label))
        }
        hasPrev={currentAsset?.previous} 
      />
      <Content />
    </>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));