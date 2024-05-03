import { Objeto } from "./objeto";
import * as THREE from 'three'

export default class ElementoCSS2D extends Objeto{

    constructor(textoCSS2D, container){
        super();

        this.texto     = textoCSS2D;
        this.mesh      = textoCSS2D;
        this.container = container; //Fase ou whiteboard que vai conter esse objeto

        this.tamanhoHitbox = new THREE.Vector3(1.05, 1.3, 0) //Constante aumenta tamanho da hitbox

        this.gerarHitbox();
    }

    gerarHitbox(){

        const retangulo = this.texto.element.getBoundingClientRect();

        const posicao  = this.container.pixelToCoordinates(
                            (retangulo.left   + retangulo.right)/2,
                            (retangulo.bottom + retangulo.top  )/2
                        );

        //Dois pontos inferior esquerdo e superior direito 
        //para calcular largura e altura do texto no canvas
        const ponto1  = this.container.pixelToCoordinates(
                            retangulo.left,
                            retangulo.bottom
                        );

        const ponto2  = this.container.pixelToCoordinates(
                            retangulo.right,
                            retangulo.top
                        );

        const dimensoes = ponto2.clone().sub(ponto1);

        const altura    = dimensoes.y * this.tamanhoHitbox.y;
        const largura   = dimensoes.x * this.tamanhoHitbox.x;

        const plano = new THREE.Mesh(
                        new THREE.PlaneGeometry(largura,altura), 
                        new THREE.MeshBasicMaterial({visible:false})
                    );

        plano.position.copy(posicao);

        this.container.scene.add(plano);

        this.hitbox = plano;
    }
}