import React, { useState } from 'react';


import MenuTrocaFase from '../MenuTrocaFase/MenuTrocaFase';
import AboveContainer  from '../AboveContainer/AboveContainer'
import CartasContainer from '../CartasContainer/CartasContainer';


import './style.css'; // Importe o arquivo de estilo


import { FiMenu } from 'react-icons/fi'
import { GiCardAceSpades } from 'react-icons/gi'


const cartas = [
  { valor: 'A', naipe: 'copas' },
  { valor: '2', naipe: 'espadas' },
  { valor: 'K', naipe: 'ouros' },
  // Adicione mais cartas conforme necessário
];

function MenuEquacoes(props) {

  console.log(props, "esse")


  return (
    <div id="equationWindow" hidden={props.hidden}> </div>
      
  );
}

export default MenuEquacoes;
