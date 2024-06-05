// TransitionArrow.jsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './styles.css'; // Make sure to import the CSS file
import imagem from '../../assets/arrow4.png'

const TransitionArrow = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const nextLevel = parseInt(id) + 1;

  const handleNavigation = () => {
    window.location.href = `/level/${nextLevel}`;
  };

  return (
    <div 
      className="transition-arrow"
      onClick={handleNavigation}
    >
      <img src={imagem} alt="Next Level" />
      <span style={{position:'absolute', top: '148px'}}className="transition-text">PRÓXIMA FASE</span>
  </div>)
}

export default TransitionArrow;