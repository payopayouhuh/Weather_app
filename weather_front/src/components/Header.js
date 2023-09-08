import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HeaderContainer = styled.div`
  background-color: #333;
  color: white;
  display: flex;
  align-items: center;
  padding: 1rem;
`;

const AppIcon = styled.div`
  margin-right: 1rem;
  cursor: pointer;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Link to="/">
        <AppIcon>
          {/* ここにアイコンを追加 */}
          <span role="img" aria-label="home-icon">🏠</span>
        </AppIcon>
      </Link>
      <h1>Weather App</h1>
    </HeaderContainer>
  );
};

export default Header;
