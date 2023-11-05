import * as THREE from 'three'
import { useEffect, useRef, useState } from "react";
import { Teste } from './teste';
import { Fase } from './js/fases/fase';
import { Fase1 } from './js/fases/fase1';
import { Fase5 } from './js/fases/fase5';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

// COMPONENTES
import AboveContainer  from './components/AboveContainer/AboveContainer'
import MenuTrocaFase from './components/MenuTrocaFase/MenuTrocaFase';
import Navbar from './components/Navbar/Navbar';
import { Fase3 } from './js/fases/fase3';
import { Fase2 } from './js/fases/fase2';
import { Fase4 } from './js/fases/fase4';

const fases = [
  Fase1,
  Fase2,
  Fase3,
  Fase4,
  Fase5
]

function MyThree() {
  const refContainer = useRef<HTMLDivElement | null>(null); // Adicionando o tipo HTMLDivElement | null
  const [indFase, SetIndFase] = useState(1);

  useEffect(() => {

    const width = 10;
    const height = 8;

    // === THREE.JS CODE START ===
    const scene = new THREE.Scene();
    // const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.domElement.id = 'MEUCANVAS';
    renderer.setSize(window.innerWidth, window.innerHeight);

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.hidden = false;

    const fase = new Fase5({
      scene, 
      width: window.innerWidth,
      height: window.innerHeight,
      renderer,
      camera,
      labelRenderer
    });

    const container = document.createElement('p');
    container.style.fontFamily = "Courier New, monospace";
    container.style.fontSize = "25px";
    container.style.fontWeight ="italic";
    container.style.display = 'inline-block';
    console.log('SETUPTEXTBOX CONTAINER', container)

    // Create the CSS2DObject using the container
    const cPointLabel = new CSS2DObject(container);   
    cPointLabel.position.y = 3.5
    console.log('CPOINTLABEL', cPointLabel)

    cPointLabel.element.textContent = 'teste'

    scene.add(cPointLabel);

    // use ref as a mount point of the Three.js scene instead of the document.body
    refContainer.current && refContainer.current.appendChild(renderer.domElement);
    // refContainer.current && refContainer.current.appendChild(labelRenderer.domElement);

    camera.position.z = 150;

    const animate = () => {
      requestAnimationFrame(animate);
      fase.update();
      renderer.render(scene, camera);
    };
    animate();
  }, []);


  return (
    <>
      <Navbar />
      <AboveContainer top={150} left={50}>
        <MenuTrocaFase
          fases={fases}
          onTrocarFase={() => {
            console.log()
          }}
        />
      </AboveContainer>
      <div className='container de tudo' ref={refContainer}></div>
    </>
  );  
}

export default MyThree;
