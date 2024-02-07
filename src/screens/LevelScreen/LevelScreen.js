import React, { useEffect, useRef } from 'react'
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

const fases = {
  '1' : Fase1,
  '2' : Fase2,
  '3' : Fase3,
  '4' : Fase4,
  '5' : Fase5,
  '6' : Fase6,
  '7' : Fase7,
}

const LevelScreen = () => {

  const { id } = useParams();
  const refContainer = useRef(null);

  // ====== INICIANDO FASE ========
  useEffect(() => {
    const fase = new fases[id];
    const whiteboard = new Whiteboard();

    // use ref as a mount point of the Three.js scene instead of the document.body
    refContainer.current && refContainer.current.appendChild(fase.renderer.domElement);
    refContainer.current && refContainer.current.appendChild(fase.labelRenderer.domElement)

    fase.start(); //Começa o loop de animações

    whiteboard.start();
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

  return (
    <div
      className="App"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      >
      <div className='container de tudo' ref={refContainer}></div>
    </div>
  )
}

export default LevelScreen