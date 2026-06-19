import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import StudioPage from './components/StudioPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/studio" element={<StudioPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
