import {BrowserRouter,Routes,Route} from 'react-router-dom'

//pages and componenets
import Home from "./pages/Home"
import Navbar from './components/Navbar';
import TrainOutput from './components/TrainOutput';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar/>
      <div className="pages">
      <Routes>
        <Route
        path="/"
        element={<Home/>}
        />
        <Route
        path="/train"
        element={<TrainOutput/>}
        />

      </Routes>


      </div>
      
      
      </BrowserRouter>
      
    </div>
  );
}

export default App;
