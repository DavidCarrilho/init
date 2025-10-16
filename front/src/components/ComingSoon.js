import React from 'react';

const ComingSoon = ({ children, disabled = true, message = "Em breve" }) => {
  return (
    <div className="coming-soon-wrapper">
      <div className={`coming-soon-content ${disabled ? 'disabled' : ''}`}>
        {children}
      </div>
      <div className="coming-soon-badge">
        <span className="coming-soon-text">🚀 {message}</span>
      </div>
    </div>
  );
};

export default ComingSoon;