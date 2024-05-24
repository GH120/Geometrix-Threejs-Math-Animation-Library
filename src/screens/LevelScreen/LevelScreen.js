import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Fase1 } from '../../js/fases/fase1';
import { Fase2 } from '../../js/fases/fase2';
import { Fase3 } from '../../js/fases/fase3';
import { Fase4 } from '../../js/fases/fase4';
import { Fase5 } from '../../js/fases/fase5';
import { Fase6 } from '../../js/fases/fase6';
import { Fase7 } from '../../js/fases/fase7';
import { Whiteboard } from '../../js/cards/whiteboard';
import Navbar from '../../components/Navbar/Navbar';
import { PrimeiraFase } from '../../js/fases/PrimeiraFase';

const fases = {
  '1' : Fase4,
  '2' : Fase5,
  '3' : PrimeiraFase,
  '4' : PrimeiraFase,
  '5' : Fase4,
  '6' : Fase5,
  '7' : PrimeiraFase,
  '8' : PrimeiraFase
}

const LevelScreen = () => {

  const { id } = useParams();
  const refContainer = useRef(null);
  const [levelLoad, setLevelLoad] = useState(false);
  const [fase, setFase] = useState(null);
  const [whiteboard, setWhiteboard] = useState(null);
  const [cursor, setCursor] = useState('default');

  // ====== INICIANDO FASE ========
  useEffect(() => {
    const fase = new fases[id];
    // const whiteboard = new Whiteboard();
    
    // use ref as a mount point of the Three.js scene instead of the document.body
    refContainer.current && refContainer.current.appendChild(fase.renderer.domElement);
    refContainer.current && refContainer.current.appendChild(fase.labelRenderer.domElement)
    
    // whiteboard.start();
    fase.start(); //Começa o loop de animações

    setFase(fase);
    setWhiteboard(whiteboard);
    setLevelLoad(true);
    
  }, []);

  // ====== HANDLE DE CARTAS ========
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');

    if (data) {
      const carta = document.querySelector(`[data-draggable="true"]`);

      console.log(carta);

      if (carta) {
        carta.style.left = e.clientX + 'px';
        carta.style.top = e.clientY + 'px';
      }
    }
  };

  const settings = {fase, whiteboard, setCursor: (tipo) => {setCursor(tipo); settings.tipo = tipo}, tipo: cursor}

  return (
      <div
      className="App"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      >
        {levelLoad && <Navbar settings={settings}/>}
        <div className='container de tudo' style={{cursor:cursor}} ref={refContainer}></div>
      </div>

  )
}

export default LevelScreen