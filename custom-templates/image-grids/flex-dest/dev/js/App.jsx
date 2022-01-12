function Header() {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      padding: '10px 0px', 
      marginLeft:'20px',
      }}
    >
      <i
      className="material-icons"
      style={{ 
        color: '#9b9b9b', 
        cursor: 'pointer', 
        marginRight: '20px',
      }}
      onClick="goHome()"
      >
        home
      </i>
      <i
      id="back"
      className="material-icons"
      style={{ 
        color: '#9b9b9b', 
        marginLeft: '-5px', 
        opacity: 0.2,
      }}
      onClick="goBack()"
      >
        keyboard_arrow_left
      </i>
      <div 
        style={{ 
        color: '#717171', 
        padding: '0px 10px',
        }} 
        id="externalid"
      >
        Label this asset
      </div>
      <i
      id="next"
      className="material-icons"
      style={{ 
        color: '#9b9b9b', 
        marginLeft: '-5px', 
        opacity: 0.2 
      }}
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