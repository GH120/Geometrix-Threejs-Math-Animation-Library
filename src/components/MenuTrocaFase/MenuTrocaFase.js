import React, { useState, useEffect } from 'react';
import * as THREE from 'three'
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import './style.css'

const MenuTrocaFase = ({ fases, onTrocarFase }) => {
  const [faseSelecionada, setFaseSelecionada] = useState(0);

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

    parenteCanvas.removeChild(meuCanvas);
    const faseAtual = fases[faseSelecionada];

    const width = 10;
    const height = 8;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.domElement.id = 'MEUCANVAS';
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 150;

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.hidden = false;

    const objetoFaseAtual = new faseAtual({
      scene,
      width: window.innerWidth,
      height: window.innerHeight,
      renderer,
      camera,
      labelRenderer
    });

    parenteCanvas.appendChild(renderer.domElement)

    const animate = () => {
      requestAnimationFrame(animate);
      objetoFaseAtual.update();
      renderer.render(scene, camera);
    };
    animate();

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
