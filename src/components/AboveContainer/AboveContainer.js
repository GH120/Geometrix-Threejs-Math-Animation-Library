import React from 'react';
import './style.css'

const ComponenteSobreCanvas = ({ top, left, children }) => {
  const style = {
    top: top || 0,
    left: left || 0,
  };

  return (
    <div className='componenteSobreCanvas' style={style}>
      {children}
    </div>
  );
};

export default ComponenteSobreCanvas;
