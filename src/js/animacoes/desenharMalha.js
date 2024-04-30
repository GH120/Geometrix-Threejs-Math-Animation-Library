//Desenha triângulo por triângulo a malha desejada, em ordem
import * as THREE from 'three';
import Animacao from "./animation";
import { Objeto } from '../objetos/objeto';

export default class DesenharMalha extends Animacao{

    constructor(objeto, scene){

        super(objeto);

        //Gambiarra
        //Objeto é uma mesh, transforma ele em um Objeto
        if(!objeto.mesh){

            objeto = Objeto.fromMesh(objeto);
            this.objeto = objeto;
        }

        this.scene = scene;
        this.valorInicial = 0;
        this.frames = 44;
        this.voltar = false;

        objeto.mesh.visible = false;
        
        this.onStart = () => {
            
            objeto.addToScene(scene);
            objeto.mesh.visible = false;
            this.valorFinal   = objeto.mesh.geometry.attributes.position.count;
            
        }


        this.setUpdateFunction(function(posicao){

            const intervalo = (this.reverso)? [-posicao*3] : [0, posicao*3]
            
            const posicoes = this.objeto.mesh.geometry.attributes.position.array.slice(...intervalo);

            const geometry = new THREE.BufferGeometry();

            geometry.setAttribute('position', new THREE.Float32BufferAttribute(posicoes, 3));

            scene.remove(this.malha)

            this.malha = new this.objeto.mesh.constructor(geometry, this.objeto.material);

            this.malha.position.copy(this.objeto.mesh.position)
            
            scene.add(this.malha);
        })
    }

    reverse(){
        this.reverso = true;
        return this;
    }

    onTermino(){
        this.scene.remove(this.malha);
        if(!this.voltar) this.objeto.mesh.visible = true;
    }

    interpolacao(inicial, final, peso){

        const curva = (x) => Math.sin((x * Math.PI) / 2);

        peso = curva(peso);

        return Math.round(inicial*(1-peso) + final*peso);
    }
}