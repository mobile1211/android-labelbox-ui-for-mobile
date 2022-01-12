import Header from './Header.jsx';
import Content from './Content.jsx';

console.log(Header)
console.log(Content)

function App() {
  return (
    <>
      <Header />
      <Content />
    </>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));