import * as THREE from 'three';
import {CSS2DObject, CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer';
import {Triangle} from './js/objetos/triangle';
import grid from './assets/grid.avif';

import { Fase1 } from './js/fases/fase1';
// import { Fase2 } from './js/fases/fase2';
// import { Fase4 } from './js/fases/fase4';
// import { Fase5 } from './js/fases/fase5';
// import { Fase6 } from './js/fases/fase6';

import Bracket from './js/objetos/bracket'
import DesenharMalha from './js/animacoes/desenharMalha';
import { Fase3 } from './js/fases/fase3';
import { Distributividade } from './js/animacoes/distributividade';
import { Addition, Equality, Multiplication, Square, Value, Variable } from './js/equations/expressions';
import { Operations } from './js/equations/operations';
import { Programa } from './programa';
import { useEffect, useRef, useState } from 'react';

export function Teste(props) {
  const refContainer = useRef(null); // Adicionando o tipo HTMLDivElement | null
  const [fase, setFase] = useState(null);
  
  useEffect(() => {

    const scene = new THREE.Scene();

    const fase = new Fase1();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight)

  }, []);

  useEffect(() => {
    console.log('FASE USEEFFECT', fase);
  }, [fase]);

  return (
    <>
    <div>
      <div ref={refContainer}></div>
    </div>
    </>
  )
}