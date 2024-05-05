import { HoverPosition } from "../inputs/position";
import { Objeto } from "../objetos/objeto";
import { Output } from "./Output";
import * as THREE from 'three';

export default class InsideElipse extends Output{

    constructor(aresta, distanciaDeHover, camera, scene){

        super();

        this.aresta = aresta;
        this.distanciaDeHover = distanciaDeHover;

        this.hitbox = Objeto.fromMesh(new THREE.Mesh(new THREE.PlaneGeometry(100,100), new THREE.MeshBasicMaterial({visible:false})));

        scene.add(this.hitbox);

        this.addInputs(new HoverPosition(this.hitbox, camera));

        this.setEstadoInicial({
            dentroDaElipse: false
        })

    }

    _update(novoEstado){

        const aresta = this.aresta;
        const estado = this.estado;
                            
        const foco1 = aresta.origem.clone();
        const foco2 = aresta.destino.clone();

        const posicaoMouse = novoEstado.position;

        //Círculo
        // const distanciaDoMouse = posicao.clone().sub(posicaoMouse).length();

        //Elipse
        const distanciaEntreEixos = new THREE.Vector3().subVectors(foco1, foco2).length();

        const semieixo = distanciaEntreEixos + this.distanciaDeHover * 2;

        const distanciaDoMouse = posicaoMouse.clone().sub(foco1).length() + posicaoMouse.clone().sub(foco2).length(); 

        const dentroDaElipse = distanciaDoMouse < semieixo;

        console.log(dentroDaElipse)
        
        if(estado.dentroDaElipse != dentroDaElipse){
            
            estado.dentroDaElipse = dentroDaElipse;

            this.notify({dentro: estado.dentroDaElipse});
        }
    }
}