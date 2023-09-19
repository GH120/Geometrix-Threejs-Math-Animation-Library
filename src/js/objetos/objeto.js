export class Objeto{

    //Cria a malha do objeto
    render(){

    }
    //Retira a malha da cena, atualiza a malha e adicioca ela de novo a cena
    update(){

    }

    //Adiciona a malha a cena e seta a cena do objeto
    addToScene(scene){
        this.scene = scene;
        if(this.mesh) scene.add(this.mesh);
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
}