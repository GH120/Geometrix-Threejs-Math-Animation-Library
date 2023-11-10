import React, { useState, useEffect } from 'react';
import * as THREE from 'three'
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import './style.css'

const MenuTrocaFase = ({ fases, onTrocarFase }) => {
  const [faseSelecionada, setFaseSelecionada] = useState(4);

  const handleChangeFase = (faseIndex) => {
    console.log("INDEX ATUAL:", faseIndex);
    setFaseSelecionada(faseIndex);
    onTrocarFase(faseIndex);
  };

  useEffect(() => {
    const meuCanvas = document.getElementById('MEUCANVAS');
    if (!meuCanvas) {
      return;
    }

    const parenteCanvas = meuCanvas.parentNode;

    //Limpa o canvas do pai
    parenteCanvas.innerHTML = '';

    //Tira o dialogo do labelRenderer
    document.body.removeChild(document.getElementById("dialogo"))
    
    const faseAtual = new fases[faseSelecionada]();

    // use ref as a mount point of the Three.js scene instead of the document.body
    parenteCanvas.appendChild(faseAtual.renderer.domElement);
    document.body.appendChild(faseAtual.labelRenderer.domElement)

    faseAtual.start(); //Começa o loop de animações

  }, [faseSelecionada]);

  return (
    <>
      <div className="troca-fase-menu">
        <div className='h2Container'>
          <h2>Menu de Troca de Fase</h2>
        </div>
        <ul>
          {fases.map((fase, index) => { return (
            <li
              key={index}
              className={index === faseSelecionada ? 'fase-selecionada' : ''}
              onClick={() => handleChangeFase(index)}
            >
              {/* {fase} */}
              {[2, 3, 5].includes(index) ? 'REFATORAR' : 'Fase ' + (index+1)}
            </li>
          )})}
        </ul>
      </div>

      {/* a fase aqui */}

    </>

  );
};

export default MenuTrocaFase;
