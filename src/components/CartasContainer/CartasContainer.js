import React, { useState } from 'react';
import Carta from '../Carta/Carta';
import './style.css'

function CartasContainer(props) {
  const [cartaEmFrente, setCartaEmFrente] = useState(null);

  const handleMouseEnter = (index) => {
    setCartaEmFrente(index);
  };

  const handleMouseLeave = () => {
    setCartaEmFrente(null);
  };

  const cartas = props.cartas;

  return (
    <div className="lista-cartas">
      {cartas.map((carta, index) => (
        <div
          key={index}
          className={`carta-container ${index === cartaEmFrente ? 'em-frente' : ''}`}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        >
          <Carta valor={carta.valor} naipe={carta.naipe} />
        </div>
      ))}
    </div>
  );
}

export default CartasContainer;
