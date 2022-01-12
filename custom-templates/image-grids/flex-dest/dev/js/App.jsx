const { useState, useCallback } = React;

function Header() {
  const handleGoHome = useCallback(() => {
    window.location.href =
    "https://app.labelbox.com/projects/" + state.projectId;
  }, []);

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
      onClick="goBack()"
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
      onClick="goNext()"
      >
        keyboard_arrow_right
      </i>
    </div>
  );
}

function Content() {
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
          onClick="skip()"
          >
            Skip
          </a>
          <a
          className="waves-effect waves-light btn-large"
          style={{ 
            backgroundColor: '#03a9f4', 
            width: '100%' 
          }}
          onClick="submit()"
          >
            Submit
          </a>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <>
      <Header />
      <Content />
    </>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));