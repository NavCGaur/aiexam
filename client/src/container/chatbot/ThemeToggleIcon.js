import React from 'react';

const ThemeToggleIcon = ({ onClick }) => (
  <i
    className="fas fa-adjust"
    onClick={onClick}
    style={{ cursor: 'pointer', marginRight: '10px' }}
  />
);

export default ThemeToggleIcon;