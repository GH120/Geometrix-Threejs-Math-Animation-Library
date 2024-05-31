import React, { useState } from 'react';
import './style.css'

import Carta from '../Carta/Carta';

function CartasContainer(props) {
  const [cartaEmFrente, setCartaEmFrente] = useState(null);

  const handleMouseEnter = (index) => {
    setCartaEmFrente(index);
  };

  const handleMouseLeave = () => {
    setCartaEmFrente(null);
  };

  const cartas = props.cartas;
  const settings = props.settings;
  const mostrarCartas = props.mostrarCartas;

  if (mostrarCartas)
    return (
      <div className="lista-cartas">
        {cartas.map((carta, index) => (
          <div
            key={index}
            className={`carta-container ${index === cartaEmFrente ? 'em-frente' : ''}`}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <Carta 
              tipoDaCarta={carta} 
              imagem={carta.imagem}
              settings={settings} 
            />
          </div>
        ))}
      </div>
    );
}

export default CartasContainer;
