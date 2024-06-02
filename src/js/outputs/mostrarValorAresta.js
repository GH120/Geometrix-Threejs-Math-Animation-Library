import { mathjax } from 'mathjax-full/js/mathjax.js';
import { TeX } from 'mathjax-full/js/input/tex.js';
import { SVG } from 'mathjax-full/js/output/svg.js';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages';
import * as THREE from 'three';
import { Output } from './Output';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { apagarCSS2 } from '../animacoes/apagarCSS2';
import MostrarTexto from '../animacoes/MostrarTexto';

export default class MostrarValorAresta extends Output{

    constructor(aresta, valor, unidadeMedida){
        super();

        this.aresta  = aresta;
        this.valor   = valor;
        this.unidadeMedida = unidadeMedida; //função do tipo (valor : float) => texto : string

        this.texto = this.createMathJaxTextBox("null", [0,0,0]); 
        this.distanciaTextoAresta = 0.2
        this.tamanhoDaFonte       = 5;

        aresta.mostrarValorAresta = this;
    }

    calcularPosicaoTexto(){

        const position      = this.aresta.getPosition();

        //Verificar se antihorário ou horário depois
        const direcaoAresta    = new THREE.Vector3().subVectors(position, this.aresta.origem.clone());
        const direcaoParalela  = new THREE.Vector3().crossVectors(direcaoAresta, new THREE.Vector3(0,0,-1));

        const distanciaTextoAresta = direcaoParalela.normalize().multiplyScalar(this.distanciaTextoAresta);

        position.add(distanciaTextoAresta);

        this.texto.position.copy(position);
    }

    _update(){

        if(!this.scene) console.log("Falta adicionar cena...");

        const variavelTemValor = this.aresta.variable.value;

        if(!variavelTemValor){
            this.scene.remove(this.texto);
        }
        else{
            this.scene.add(this.texto);
        }

        this.calcularPosicaoTexto();

        const valorEmFormaDeTexto = this.unidadeMedida(this.aresta.length);

        this.texto.mudarTexto(valorEmFormaDeTexto, this.tamanhoDaFonte);
    }

    addToScene(scene){
        this.scene = scene;

        // this.scene.add(this.texto);

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

    animacao(){

        return new MostrarTexto(this.texto)
                .setDuration(50)
                .setValorFinal(50)
                .setOnStart(() => this.update({}))
    }

    aparecer(dentro){

        if(dentro == false) return apagarCSS2(this.texto, this.scene);

        return  apagarCSS2(this.texto).reverse()
                                    .setOnTermino(() => null)
                                    .setOnStart(() => this.update({dentro: true}))
    }
}