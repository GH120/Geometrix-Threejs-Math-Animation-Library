import * as THREE from 'three'
import { useEffect, useRef, useState } from "react";
import { Teste } from './teste';
import { Fase } from './js/fases/fase';
import { Fase1 } from './js/fases/fase1';
import { Fase3 } from './js/fases/fase3';
import { Fase2 } from './js/fases/fase2';
import { Fase4 } from './js/fases/fase4';
import { Fase5 } from './js/fases/fase5';
import { Fase6 } from './js/fases/fase6';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

// COMPONENTES
import AboveContainer  from './components/AboveContainer/AboveContainer'
import MenuTrocaFase from './components/MenuTrocaFase/MenuTrocaFase';
import Navbar from './components/Navbar/Navbar';
import Carta from './components/Carta/Carta';
import CartasContainer from './components/CartasContainer/CartasContainer';

const fases = [
  Fase1,
  Fase2,
  Fase3,
  Fase4,
  Fase5,
  Fase6
]

function MyThree() {
  const refContainer = useRef<HTMLDivElement | null>(null); // Adicionando o tipo HTMLDivElement | null
  const [indFase, SetIndFase] = useState(1);

  const cartas = [
    { valor: 'A', naipe: 'copas' },
    { valor: '2', naipe: 'espadas' },
    { valor: 'K', naipe: 'ouros' },
    // Adicione mais cartas conforme necessário
  ];

  useEffect(() => {

    const fase = new Fase5();

    // use ref as a mount point of the Three.js scene instead of the document.body
    refContainer.current && refContainer.current.appendChild(fase.renderer.domElement);
    document.body.appendChild(fase.labelRenderer.domElement)

    fase.start(); //Começa o loop de animações
  }, []);

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');

    if (data) {
      const carta: HTMLElement | null = document.querySelector(`[data-draggable="true"]`);

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
      <Navbar />
      <AboveContainer top={150} left={50}>
        <MenuTrocaFase
          fases={fases}
          onTrocarFase={() => {
            console.log()
          }}
        />
      </AboveContainer>
      <CartasContainer cartas={cartas}/>
      <div className='container de tudo' ref={refContainer}></div>
    </div>
  );  
}

export default MyThree;
