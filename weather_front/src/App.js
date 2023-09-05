import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [coordinates, setCoordinates] = useState({ latitude: '35.6895', longitude: '139.6917' });
  const [dateRange, setDateRange] = useState({ startDate: '2020-05-01', startTime: '00:00', endDate: '2020-10-01', endTime: '00:00' });
  const [weatherData, setWeatherData] = useState(null);

  const fetchData = async () => {
    const api_url = "http://localhost:5000/api/weather";

    const data = {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      startDate: dateRange.startDate,
      startTime: dateRange.startTime,
      endDate: dateRange.endDate,
      endTime: dateRange.endTime,
    };

    const response = await axios.post(api_url, data);

    if (response.status === 200) {
      setWeatherData(response.data);
    } else {
      setWeatherData({ error: 'Could not retrieve data' });
    }
  };

  const updateTime = (field, value) => {
    setDateRange({
      ...dateRange,
      [field]: value,
    });
  };

  return (
    <div>
      <h1>Enter Latitude, Longitude, Start and End Time</h1>
      <button onClick={() => setCoordinates({ latitude: '35.6895', longitude: '139.6917' })}>東京</button>
      <button onClick={() => setCoordinates({ latitude: '34.6937', longitude: '135.5023' })}>大阪</button>
      <button onClick={() => setCoordinates({ latitude: '35.1815', longitude: '136.9066' })}>名古屋</button>
      <form>
        <label>
          Start Date: <input type="text" value={dateRange.startDate} onChange={(e) => updateTime('startDate', e.target.value)} />
        </label>
        <label>
          Start Time: <input type="text" value={dateRange.startTime} onChange={(e) => updateTime('startTime', e.target.value)} />
        </label>
        <label>
          End Date: <input type="text" value={dateRange.endDate} onChange={(e) => updateTime('endDate', e.target.value)} />
        </label>
        <label>
          End Time: <input type="text" value={dateRange.endTime} onChange={(e) => updateTime('endTime', e.target.value)} />
        </label>
      </form>
      <button onClick={fetchData}>Get Weather</button>
      <button onClick={() => window.open('http://localhost:5000/download_csv')}>Download CSV</button>

      {weatherData && <pre>{JSON.stringify(weatherData, null, 2)}</pre>}
    </div>
  );
}

export default App;
