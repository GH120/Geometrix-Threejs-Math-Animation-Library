import { mathjax } from 'mathjax-full/js/mathjax.js';
import { TeX } from 'mathjax-full/js/input/tex.js';
import { SVG } from 'mathjax-full/js/output/svg.js';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages';
import * as THREE from 'three';
import { Output } from './Output';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

export default class MostrarNomeVertice extends Output{

    constructor(poligono, vertice, nome){
        super();

        this.poligono = poligono;
        this.vertice  = vertice;
        this.indice   = this.poligono.vertices.indexOf(vertice);
        this.nome     = nome;

        this.texto = this.createMathJaxTextBox(nome, [0,0,0]); 
        this.distanciaTextoVertice = 0.32
        this.tamanhoDaFonte        = 10;
    }

    calcularPosicaoTexto(){

        const indice          = this.indice;
        const numeroVertices  = this.poligono.vertices.length
        const proximoVizinho  = (indice +1) % numeroVertices;
        const vizinhoAnterior = (indice + numeroVertices - 1) % numeroVertices;

        const vizinho1 = this.poligono.vertices[proximoVizinho];
        const vizinho2 = this.poligono.vertices[vizinhoAnterior];

        const position      = this.vertice.getPosition();

        //Verificar se antihorário ou horário depois
        const direcaoVizinhos    = new THREE.Vector3().subVectors(vizinho2.getPosition(), vizinho1.getPosition());

        const direcaoPerpendicular  = new THREE.Vector3().crossVectors(direcaoVizinhos, new THREE.Vector3(0,0,1));

        const distanciaTextovertice = direcaoPerpendicular.normalize().multiplyScalar(this.distanciaTextoVertice);

        position.add(distanciaTextovertice);

        this.texto.position.copy(position);
    }

    _update(){

        if(!this.scene) console.log("Falta adicionar cena...");

        this.calcularPosicaoTexto();

        this.texto.mudarTexto(this.nome, this.tamanhoDaFonte);
    }

    addToScene(scene){
        this.scene = scene;

        this.scene.add(this.texto);

        return this;
    }

    createMathJaxTextBox(inputTex,position=[0,0,0], tamanhoDaFonte=10){

        const adaptor = liteAdaptor();
        RegisterHTMLHandler(adaptor);

        const tex = new TeX({ packages: AllPackages });
        const svg = new SVG();
        const html = mathjax.document('', { InputJax: tex, OutputJax: svg });

        const elementoDiv = document.createElement("div");
        const cPointLabel = new CSS2DObject(elementoDiv);

        cPointLabel.position.x = position[0];
        cPointLabel.position.y = position[1];
        cPointLabel.position.z = position[2];

        // Função auxiliar para mudar texto renderizado pelo mathjax dinamicamente
        cPointLabel.mudarTexto = function(text, fontsize=10){

            //Cria o html e coloca ele dentro do div
            const display = html.convert(text, { display: true });

            elementoDiv.innerHTML = adaptor.innerHTML(display);

            //Configura tamanho da fonte
            elementoDiv.children[0].style.width  = `${fontsize*text.length/10}em`;
            elementoDiv.children[0].style.height = `${fontsize*text.length/10}em`;
            elementoDiv.children[0].style.color  = 'black';

            return cPointLabel;
        }

        return cPointLabel.mudarTexto(inputTex, tamanhoDaFonte);
    }
}