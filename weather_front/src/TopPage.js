import React from 'react';
import { Link } from 'react-router-dom';

const TopPage = () => {
  return (
    <div>
      <h2>Welcome to My Weather App</h2>
      <Link to="/weather">
        <button>Go to Weather Page</button>
      </Link>
    </div>
  );
};

export default TopPage;
