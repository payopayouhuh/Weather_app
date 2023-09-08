import React, { useState } from 'react';
import axios from 'axios';
import ChartComponent from './ChartComponent';
import './App.css';

// const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';
//const serverUrl = 'http://flask_app:5000';
const serverUrl = 'http://127.0.0.1:5000';
//http://127.0.0.1:5000



function WeatherPage() {
  const [coordinates, setCoordinates] = useState({ latitude: '35.6895', longitude: '139.6917' });
  const [dateRange, setDateRange] = useState({ startDate: '2020-05-01', startTime: '00:00', endDate: '2020-10-01', endTime: '00:00' });
  const [weatherData, setWeatherData] = useState(null);
  const [businessHours, setBusinessHours] = useState({ open_hour: 9, close_hour: 20 });
  const [timeRange ,setTimeRange] = useState({ time_unit: '/day'})
  const [selectedNumCols, setSelectedNumCols] = useState([]);
  const [selectedNonNumCols, setSelectedNonNumCols] = useState([]);
  const [timestamp, setTimestamp] = useState(Date.now());

  const [prefecture, setPrefecture] = useState("");
  const [area, setArea] = useState("");
  const areaData = {
    "宮城県": ["仙台"],
    "東京都": ["東京23区東", "東京23区西", "都下東", "都下西"],
    "千葉県": ["南房総"],
    "神奈川県": ["横浜", "川崎"],
    "愛知県": ["名古屋"],
    "京都府": ["京都"],
    "大阪府": ["大阪", "東大阪"],
    "兵庫県": ["神戸"],
    "福岡県": ["福岡"]
  };
  
  const coordinateData = {
    "仙台": { latitude: '38.2682', longitude: '140.8694' },
    "東京23区東": { latitude: '35.6895', longitude: '139.6917' },
    "東京23区西": { latitude: '35.6895', longitude: '139.6917' },
    "都下東": { latitude: '35.6895', longitude: '139.6917' },
    "都下西": { latitude: '35.6895', longitude: '139.6917' },
    "南房総": { latitude: '34.9833', longitude: '139.8667' },
    "横浜": { latitude: '35.4437', longitude: '139.6380' },
    "川崎": { latitude: '35.5300', longitude: '139.7030' },
    "名古屋": { latitude: '35.1815', longitude: '136.9066' },
    "京都": { latitude: '35.0116', longitude: '135.7681' },
    "大阪": { latitude: '34.6937', longitude: '135.5023' },
    "東大阪": { latitude: '34.6937', longitude: '135.5023' },
    "神戸": { latitude: '34.6901', longitude: '135.1955' },
    "福岡": { latitude: '33.5904', longitude: '130.4017' }
  };
  

  const handlePrefectureChange = (e) => {
    setPrefecture(e.target.value);
    setArea(""); 
  };
  const handleAreaChange = (e) => {
    setArea(e.target.value);
    const newCoordinates = coordinateData[e.target.value];
    if (newCoordinates) {
      setCoordinates(newCoordinates);
    }
  };
  

  const fetchData = async () => {
    //const api_url = "http://localhost:5000/api/weather";
    const api_url = `${serverUrl}/api/weather`;
    //'http://flask_app:5000'

    const data = {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      startDate: dateRange.startDate,
      startTime: dateRange.startTime,
      endDate: dateRange.endDate,
      endTime: dateRange.endTime,
      open_hour: businessHours.open_hour, 
      close_hour: businessHours.close_hour, 
      time_unit : timeRange.time_unit,
      num_cols: selectedNumCols,
      non_num_cols: selectedNonNumCols
    };

    const response = await axios.post(api_url, data);

    if (response.status === 200) {
      setWeatherData(response.data);
      setTimestamp(Date.now());
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


  const handleNumCols = (e) => {
    const value = e.target.value;
    setSelectedNumCols(prevState => 
      prevState.includes(value) ? prevState.filter(item => item !== value) : [...prevState, value]
    );
  };
  
  const handleNonNumCols = (e) => {
    const value = e.target.value;
    setSelectedNonNumCols(prevState => 
      prevState.includes(value) ? prevState.filter(item => item !== value) : [...prevState, value]
    );
  };
  


  return (
    <div className="container">
      <h4 className="title">取得する位置,期間,営業時間を指定</h4>

      <label>
      <h5  style={{fontWeight: 'bold'}}>都道府県</h5>
        <select value={prefecture} onChange={handlePrefectureChange}>
          <option value="" disabled>選択してください</option>
          {Object.keys(areaData).map((pref, index) => (
            <option key={index} value={pref}>{pref}</option>
          ))}
        </select>
      </label>

      {prefecture && (
        <label>
          <h5  style={{fontWeight: 'bold'}}>エリア</h5>
          <select value={area} onChange={handleAreaChange}>
            <option value="" disabled>選択してください</option>
            {areaData[prefecture].map((areaName, index) => (
              <option key={index} value={areaName}>{areaName}</option>
            ))}
          </select>
        </label>
      )}

    <form className="form">
      <label className="form-label">
        取得開始日: <input className="form-input" type="text" value={dateRange.startDate} onChange={(e) => updateTime('startDate', e.target.value)} />
      </label>
      <label className="form-label">
        取得開始時間: <input className="form-input" type="text" value={dateRange.startTime} onChange={(e) => updateTime('startTime', e.target.value)} />
      </label>
      <label className="form-label">
        取得終了日: <input className="form-input" type="text" value={dateRange.endDate} onChange={(e) => updateTime('endDate', e.target.value)} />
      </label>
      <label className="form-label">
        取得終了時間: <input className="form-input" type="text" value={dateRange.endTime} onChange={(e) => updateTime('endTime', e.target.value)} />
      </label>
      <label className="form-label">
        開店時間: <input className="form-input" type="number" value={businessHours.open_hour} onChange={(e) => setBusinessHours({ ...businessHours, open_hour: parseInt(e.target.value) })} />
      </label>
      <label className="form-label">
        閉店時間: <input className="form-input" type="number" value={businessHours.close_hour} onChange={(e) => setBusinessHours({ ...businessHours, close_hour: parseInt(e.target.value) })} />
      </label>
      <label>
      <h4  style={{fontWeight: 'bold'}}>データの単位を選択</h4>
      <select value={timeRange.time_unit} onChange={(e) => setTimeRange({ time_unit: e.target.value })}>
        
        <option value="/h">Hour</option>
        <option value="/day">Day</option>
        <option value="/week">Week</option>
        <option value="/tri-month">上旬-中旬-下旬</option>
        <option value="/month">Month</option>
      </select>
      </label>

      <label>
      <h4  style={{fontWeight: 'bold'}}>気象情報を選択</h4>
        

        <label className="checkbox-label">
        <input type="checkbox" value="temperature" onChange={handleNumCols} /> 温度
      </label>
      <label className="checkbox-label">
        <input type="checkbox" value="pressureChange" onChange={handleNumCols} /> 気圧変化
      </label>
      <label className="checkbox-label">
        <input type="checkbox" value="windDirection" onChange={handleNumCols} /> 風向
      </label>
      <label className="checkbox-label">
        <input type="checkbox" value="precip1Hour" onChange={handleNumCols} /> 1時間の降水量
      </label>
      <label className="checkbox-label">
        <input type="checkbox" value="precip24Hour" onChange={handleNumCols} /> 1日の降水量
      </label>
      <label className="checkbox-label">
        <input type="checkbox" value="precipMtd" onChange={handleNumCols} /> 月累計降水量
        </label>
      <label className="checkbox-label">
        <input type="checkbox" value="pressureMeanSeaLevel" onChange={handleNumCols} /> 平均海面気圧
      </label>
      <label className="checkbox-label">
        <input type="checkbox" value="relativeHumidity" onChange={handleNumCols} /> 相対湿度
      </label>
      <label className="checkbox-label">
        <input type="checkbox" value="snow1Hour" onChange={handleNumCols} /> 1時間の積雪
      </label>
      <label className="checkbox-label">
        <input type="checkbox" value="snow24Hour" onChange={handleNumCols} /> 1日の積雪
      </label>

      <label className="checkbox-label">
        <input type="checkbox" value="snowMtd" onChange={handleNumCols} /> 月累計積雪
        </label>
      <label className="checkbox-label">
        <input type="checkbox" value="temperatureChange24Hour" onChange={handleNumCols} /> 24時間の気温変化
      </label>
      <label className="checkbox-label">
        <input type="checkbox" value="temperatureDewPoint" onChange={handleNumCols} /> 露点温度
      </label>
      <label className="checkbox-label">
        <input type="checkbox" value="temperatureFeelsLike" onChange={handleNumCols} /> 体感温度
      </label>
      <label className="checkbox-label">
        <input type="checkbox" value="temperatureMax24Hour" onChange={handleNumCols} /> 24時間の最高気温
      </label>
      <label className="checkbox-label">
        <input type="checkbox" value="temperatureMin24Hour" onChange={handleNumCols} /> 24時間の最低気温
      </label>
      <label className="checkbox-label">
        <input type="checkbox" value="uvIndex" onChange={handleNumCols} /> UV指数
      </label>
      <label className="checkbox-label">
        <input type="checkbox" value="visibility" onChange={handleNumCols} /> 視認性
      </label>
      <label className="checkbox-label">
        <input type="checkbox" value="windGust" onChange={handleNumCols} /> 突風
      </label>
      <label className="checkbox-label">
        <input type="checkbox" value="windSpeed" onChange={handleNumCols} /> 風速
      </label>



      </label>
      <label>
      <h4  style={{fontWeight: 'bold'}}>天気のアイコンコード</h4>
        <input type="checkbox" value="iconCode" onChange={e => handleNonNumCols(e)} /> Icon Code
      </label>


      </form>

      <button class="city-button" onClick={fetchData}>Get Weather</button>
      <button class="button" onClick={() => window.open('http://127.0.0.1:5000/download_csv')}>Download CSV</button>



      <div style={{ maxWidth: '100%' }}>
      <img src={`${serverUrl}/get_image?timestamp=${timestamp}`} alt="Generated Plot" style={{ maxWidth: '100%', height: 'auto' }}/>
      </div>

      <div>
      {weatherData && Object.keys(weatherData).map((key, index) => (
        <div className="weather-card" key={index}>
          <span className="weather-key">{key}: </span>
          <span>{weatherData[key]}</span>
        </div>
      ))}
    </div>



    </div>


  );
}

export default WeatherPage;
