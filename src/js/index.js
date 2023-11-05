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
import { Fase6 } from './fases/fase6';

//Adicionar interface de colisão => hover.objeto = objeto, hover.objeto.hitbox -> angulo.hitbox returns angulo.mesh
//triangulo.hitbox = new Plane().setPosition(triangulo.center)

const programa = new Fase6();

//Inicia o loop de animação
programa.start();


const criarCartas = function(){

    const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
    const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"];
    
    const deck = [];
    
    for (const suit of suits) {
        for (const value of values) {
            deck.push(`${value} of ${suit}`);
        }
    }

    const cardContainer = document.createElement("div");

    cardContainer.style.position = "absolute";
    cardContainer.style.right = 0;
    cardContainer.style.bottom  = "170px";

    let shift = 0;
    let depth = 100;

    for (const card of deck) {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card");
        cardDiv.textContent = card;

        cardDiv.style.position = "absolute";
        cardDiv.style.depth    = `${depth--}px` ;
        cardDiv.style.right    = `${shift+= 4}px`;

        cardContainer.appendChild(cardDiv);
    }

    console.log(cardContainer)

    document.body.append(cardContainer)

}

// criarCartas()