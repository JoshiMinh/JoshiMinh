import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Portfolio from './pages/Portfolio';
import Ballgame from './games/ballgame';
import Conway from './games/conway';
import Ipong from './games/ipong';
import Solarsystem from './games/solarsystem';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/games/ballgame" element={<Ballgame />} />
        <Route path="/games/conway" element={<Conway />} />
        <Route path="/games/ipong" element={<Ipong />} />
        <Route path="/games/solarsystem" element={<Solarsystem />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
