import * as THREE from 'three';
import {CSS2DObject, CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer';
import {Triangle} from './objetos/triangle';
import grid from '../assets/grid.avif';
import { Fase1 } from './fases/fase1';
import { Fase2 } from './fases/fase2';
import { Fase4 } from './fases/fase4';
import Bracket from './objetos/bracket'
import DesenharMalha from './animacoes/desenharMalha';
import { Fase3 } from './fases/fase3';
import { Distributividade } from './animacoes/distributividade';
import { Addition, Equality, Multiplication, Square, Value, Variable } from './equations/expressions';
import { Operations } from './equations/operations';
import { Fase5 } from './fases/fase5';
import { Programa } from './programa';

//Adicionar interface de colisão => hover.objeto = objeto, hover.objeto.hitbox -> angulo.hitbox returns angulo.mesh
//triangulo.hitbox = new Plane().setPosition(triangulo.center)

const programa = new Fase5();

//Inicia o loop de animação
programa.start();