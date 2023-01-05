import logo from './logo.svg';
import 'bulma/css/bulma.min.css';
import './App.css';
import {EntryList} from './components/entry'
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <EntryList/>
      </header>
    </div>
  );
}

export default App;
