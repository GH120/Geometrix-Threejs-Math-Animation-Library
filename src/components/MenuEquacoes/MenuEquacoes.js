import React, { useEffect, useRef } from 'react';


import MenuTrocaFase from '../MenuTrocaFase/MenuTrocaFase';
import AboveContainer  from '../AboveContainer/AboveContainer'
import CartasContainer from '../CartasContainer/CartasContainer';


import './style.css'; // Importe o arquivo de estilo


import { FiMenu } from 'react-icons/fi'
import { GiCardAceSpades } from 'react-icons/gi'
import { Whiteboard } from '../../js/cards/whiteboard';


const cartas = [
  { valor: 'A', naipe: 'copas' },
  { valor: '2', naipe: 'espadas' },
  { valor: 'K', naipe: 'ouros' },
  // Adicione mais cartas conforme necessário
];

function MenuEquacoes(props) {

  const equationWindowRef = useRef(null);

  //Corrigir: fase não é sincronizada com a do settings
  console.log(props.fase, "this")

  const hidden = props.hidden
  const fase = props.fase;


  useEffect(() => {
    // This code will run after the component is mounted/rendered
    // Access the DOM node using the ref

    const canvas = fase.renderer.domElement; 

    const equationWindowNode = equationWindowRef.current;

    const whiteboard = new Whiteboard(fase.camera, fase.scene, canvas);

    //Whiteboard deve criar um novo canvas para adicionar as animações de equações
    //canvas vai estar em um html próprio

  }, []);


  return (
    <div id="equationWindow" ref={equationWindowRef}> </div>
  );
}

export default MenuEquacoes;
