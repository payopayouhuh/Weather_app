import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import WeatherPage from './WeatherPage'; // 既存の天気予報機能を移動
import TopPage from './TopPage'; // TOPページのコンテンツを配置

function App() {
    return (
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<TopPage />} />
            <Route path="/weather" element={<WeatherPage />} />
            {/* その他のルート */}
          </Routes>
        </Router>
      );
}

export default App;
