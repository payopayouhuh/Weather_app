import React from 'react';
import { Link } from 'react-router-dom';
import './TopPage.css'; 

const TopPage = () => {
  return (
    <div className="container2">
      <Link to="/weather" className="button-link"> 
        <button className="button2">気象情報取得ページ</button>
      </Link>
    </div>
  );
};


export default TopPage;
