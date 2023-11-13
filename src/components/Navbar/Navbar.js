import React, { useState } from 'react';


import MenuTrocaFase from '../MenuTrocaFase/MenuTrocaFase';
import AboveContainer  from '../AboveContainer/AboveContainer'
import CartasContainer from '../CartasContainer/CartasContainer';


import './style.css'; // Importe o arquivo de estilo
import { Fase1 } from '../../js/fases/fase1';
import { Fase2 } from '../../js/fases/fase2';
import { Fase3 } from '../../js/fases/fase3';
import { Fase4 } from '../../js/fases/fase4';
import { Fase5 } from '../../js/fases/fase5';
import { Fase6 } from '../../js/fases/fase6';

import { FiMenu } from 'react-icons/fi'
import { GiCardAceSpades } from 'react-icons/gi'



const fases = [
  Fase1,
  Fase2,
  Fase3,
  Fase4,
  Fase5,
  Fase6
];

const cartas = [
  { valor: 'A', naipe: 'copas' },
  { valor: '2', naipe: 'espadas' },
  { valor: 'K', naipe: 'ouros' },
  // Adicione mais cartas conforme necessário
];

function Navbar() {
  const [FaseMenuOpen, setFaseMenuOpen] = useState(false);
  const [CardsMenuOpen, setCardsMenuOpen] = useState(false);

  const toggleFaseMenu = () => {
    setFaseMenuOpen(!FaseMenuOpen);
  };

  const toggleCardsMenu = () => {
    setCardsMenuOpen(!CardsMenuOpen);
  };


  return (
    <nav className="navbar">
      <div className="buttons-container">

        <button className="menu-button" onClick={toggleFaseMenu}>
          <FiMenu />
        </button>
        <button className="menu-button" onClick={toggleCardsMenu}>
          <GiCardAceSpades />
        </button>
      </div>
      <div className={`navbar-links ${FaseMenuOpen ? 'open' : ''}`}>
        {/* colocar modal de fases aqui (eu acho) */}
        <AboveContainer top={150} left={50}>
          <MenuTrocaFase
            fases={fases}
            onTrocarFase={() => {
              console.log()
            }}
          />
        </AboveContainer>
      </div>
      <div className={`navbar-links ${CardsMenuOpen ? 'open' : ''}`}>
        {/* colocar modal de fases aqui (eu acho) */}
        {/* <AboveContainer top={150} left={50}> */}
          <CartasContainer cartas={cartas} />
        {/* </AboveContainer> */}
      </div>
      <h1 className="navbar-title">GEOMETRIX</h1>
    </nav>
  );
}

export default Navbar;
