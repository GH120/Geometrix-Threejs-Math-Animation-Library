import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import AboveContainer  from '../AboveContainer/AboveContainer'
import CartasContainer from '../CartasContainer/CartasContainer';
import MenuEquacoes from '../MenuEquacoes/MenuEquacoes';

import './style.css'; // Importe o arquivo de estilo

import { FiMenu, FiHome } from 'react-icons/fi'
import { BiMath } from "react-icons/bi";
import { GiCardAceSpades } from 'react-icons/gi'
import MenuFaseNovo from '../MenuFaseNovo/MenuFaseNovo';
import Modal from '../modal/Modal';

import { LadoParalogramo } from '../../js/cards/ladoParalelogramo';
import imagemParalelogramoLado from '../../assets/CartaParalalogramoLado.png'
import { AnguloParalogramo } from '../../js/cards/anguloParalelogramo';
import imagemAnguloParalelogramo from '../../assets/anguloParalelogramo.png'

const cartas = [
  { tipo: LadoParalogramo,   imagem: imagemParalelogramoLado },
  { tipo: AnguloParalogramo, imagem: imagemAnguloParalelogramo},
  { tipo: LadoParalogramo,   imagem: imagemParalelogramoLado },
  // Adicione mais cartas conforme necessário
];

function Navbar(props) {
  const [FaseMenuOpen, setFaseMenuOpen] = useState(false);
  const [CardsMenuOpen, setCardsMenuOpen] = useState(false);
  const [EquationMenuOpen, setEquationMenuOpen] = useState(false);
  const navigator = useNavigate();

  const settings = props.settings;

  //Coloca os settings para a fase poder usar os comandos de abrir e fechar a navbar
  //Olhar depois se isso não causa problemas com o garbage collector
  useEffect(() => {
    settings.fase.settings = settings;
  }, [])

  const toggleFaseMenu = () => {
    setFaseMenuOpen(!FaseMenuOpen);
  };

  const toggleCardsMenu = () => {
    setCardsMenuOpen(!CardsMenuOpen);
  };

  const toggleEquationMenu = () => {
    setEquationMenuOpen(!EquationMenuOpen);
  };

  settings.ativarMenuCartas = (ativo) => {
    setCardsMenuOpen(ativo);
  }


  settings.toggleEquationMenu = toggleEquationMenu;

  return (
    <nav className="navbar">
      <div className="buttons-container">
        <button className="menu-button" onClick={() => {
          navigator('/')
        }}>
          <FiHome />
        </button>
        <button className="menu-button" onClick={toggleFaseMenu}>
          <FiMenu />
        </button>
        <button className="menu-button" onClick={toggleCardsMenu}>
          <GiCardAceSpades />
        </button> 
        <button className="menu-button" onClick={toggleEquationMenu}>
          <BiMath />
        </button>
      </div>

      <Modal isOpen={FaseMenuOpen} onClose={() => setFaseMenuOpen(false)}>
        <MenuFaseNovo />
      </Modal>
      <div className={`navbar-links ${CardsMenuOpen ? 'open' : ''}`}>
        <CartasContainer cartas={cartas} settings={settings} mostrarCartas={CardsMenuOpen} />
      </div>

      <div className={`navbar-links ${EquationMenuOpen ? 'open' : ''}`}>
        <MenuEquacoes fase={settings.fase} whiteboard={settings.whiteboard} hidden= {!EquationMenuOpen} ativar = {setEquationMenuOpen}></MenuEquacoes>
      </div>

      
      <button onClick={() => navigator('/')} className='navbar-title-container'>
        <h1 className="navbar-title">GEOMETRIX</h1>
      </button>
    </nav>
  );
}

export default Navbar;
