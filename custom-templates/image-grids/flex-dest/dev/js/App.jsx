// Components
// Cannot split into separate files / modules unless we add webpack config
// https://stackoverflow.com/questions/36698354/require-is-not-defined

const { useState, useCallback } = React;
function Header() {
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
      className="material-icons back-icon"
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
      className="material-icons"
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

function App() {
  const [curr, setCurr] = useState({
    projectId: new URL(window.location.href).searchParams.get("project"),
    currentAsset: undefined
});

  return (
    <>
      <Header />
      <Content />
    </>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));