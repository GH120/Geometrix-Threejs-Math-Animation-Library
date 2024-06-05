// TransitionArrow.jsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const TransitionArrow = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const nextLevel = parseInt(id) + 1;

  return (
    <div 
      style={{ position: 'absolute', right: '10px', bottom: '10px', cursor: 'pointer' }}
      onClick={() => navigate(`/level/${nextLevel}`)}
    >
      <img src="/path/to/your/arrow/image.png" alt="Next Level" />
    </div>
  );
}

export default TransitionArrow;