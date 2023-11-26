import React, { useEffect, useRef } from 'react';


import MenuTrocaFase from '../MenuTrocaFase/MenuTrocaFase';
import AboveContainer  from '../AboveContainer/AboveContainer'
import CartasContainer from '../CartasContainer/CartasContainer';


import './style.css'; // Importe o arquivo de estilo


import { FiMenu } from 'react-icons/fi'
import { GiCardAceSpades } from 'react-icons/gi'
import { Whiteboard } from '../../js/cards/whiteboard';
import { Equality, Value, Variable } from '../../js/equations/expressions';
import { PythagorasCard } from '../../js/cards/pythagorasCard';


const cartas = [
  { valor: 'A', naipe: 'copas' },
  { valor: '2', naipe: 'espadas' },
  { valor: 'K', naipe: 'ouros' },
  // Adicione mais cartas conforme necessário
];

let whiteboard;

function MenuEquacoes(props) {

  const equationWindowRef = useRef(null);

  //Corrigir: fase não é sincronizada com a do settings
  console.log(props.fase, "this")

  useEffect(() =>{

    
  })

  const hidden = props.hidden
  const fase = props.fase;

  return (
    <div id="equationWindow" ref={equationWindowRef}> </div>
  );
}

export default MenuEquacoes;
