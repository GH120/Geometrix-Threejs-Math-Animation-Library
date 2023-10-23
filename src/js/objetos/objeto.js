import * as THREE from 'three'

export class Objeto{

    //Cria a malha do objeto
    render(){

    }
    //Retira a malha da cena, atualiza a malha e adicioca ela de novo a cena
    update(){

        this.position = this.mesh.position.clone();
        // this.rotation

        this.scene.remove(this.mesh);

        this.render();

        this.scene.add(this.mesh);
    }

    //Adiciona a malha a cena e seta a cena do objeto
    addToScene(scene){
        this.scene = scene;
        if(this.mesh) scene.add(this.mesh);
        return this;
    }

    removeFromScene(){
        this.scene.remove(this.mesh);

        //Não abrange grupos recursives, cuidado
        if(this.mesh.children){
            this.mesh.children.map(child => child.geometry.dispose());
        }
        else{
            this.mesh.geometry.dispose();
        }

        if(this.clickable) this.clickable.removeObservers();
        if(this.draggable) this.draggable.removeObservers();
        if(this.hoverable) this.hoverable.removeObservers();

        return this;
    } 

    //Como padrão, a hitbox de um objeto seria sua malha
    // get hitbox(){
    //     return this.mesh;
    // }

    // //Como padrão, a posição de um objeto seria a posição de sua malha
    // get position(){
    //     return this.mesh.position.clone();
    // }

    // set position(value){
    //     this.mesh.position.copy(value);
    // }

    getPosition(){
        return this.mesh.position.clone();
    }

    moveTo(position){
        this.mesh.position.copy(position);
    }

    static fromMesh(mesh){
        const novo = new Objeto();
        novo.mesh = mesh;
        novo.hitbox = mesh;
        novo.material = mesh.material.clone();
        novo.geometry = mesh.geometry.clone();

        novo.render = () => {
            novo.mesh = new THREE.Mesh(novo.geometry, novo.material);
            novo.mesh.position.copy(novo.position);
        }
        return novo
    }

    copia(){
        return Objeto.fromMesh(this.mesh.clone());
    }
}