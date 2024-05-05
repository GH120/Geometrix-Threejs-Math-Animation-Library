import React, { useState } from 'react';
import Carta from '../Carta/Carta';
import './style.css'
import CartaPythagoras from '../Carta/CartaPythagoras';
import CartaLadoParalelogramo from '../Carta/CartaLadoParalelogramo';

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
            <CartaLadoParalelogramo valor={carta.valor} naipe={carta.naipe} settings={settings} />
          </div>
        ))}
      </div>
    );
}

export default CartasContainer;
