import * as THREE from 'three';
import Animacao, { AnimacaoSequencial, AnimacaoSimultanea } from './animation';
import { Edge } from '../objetos/edge';
import { colorirAngulo } from './colorirAngulo';

export class Divisao extends Animacao{

    constructor(lado1, lado2, offsetPosicional = new THREE.Vector3(3,0,0), posicaoFixa = null){
        super();
        this.dividendo = lado1;
        this.divisor = lado2;
        this.offsetPosicional  = offsetPosicional;
        this.posicaoFixa = posicaoFixa
        //Gambiarra, ajeitar depois
        this.frames = 400;
        this.frameCount = 90;
        this.delay = 90;
    }

    *getFrames(){

        const colorir = new AnimacaoSimultanea(
                        colorirAngulo(this.divisor)
                        .setValorFinal(0xff0000)
                        .setValorInicial(this.divisor.material.color)
                        .setDuration(30), 
                        colorirAngulo(this.dividendo)
                        .setValorFinal(0x0000ff)
                        .setValorInicial(this.dividendo.material.color)
                        .setDuration(30)
        )


        //Posiciona primeiro os lados no canto direito, não faz nada ao terminar
        const posicionar  = this.posicionar().setDuration(this.frameCount/2).setDelay(this.delay/3);
        // Depois executa o algoritmo da divisão
        const dividir     = this.dividir();


        // Quando dividido e o delay passar, termina a execução do posicionar
        const animacao = new AnimacaoSequencial(colorir, posicionar, dividir).recalculateFrames();

        this.frames = animacao.frames+animacao.delay;

        yield* animacao.getFrames();

        if(this.voltar){

            this.divisor.removeFromScene();
            this.dividendo.removeFromScene();

            this.divisor.render();
            this.dividendo.render();

            this.divisor.addToScene(this.scene);
            this.dividendo.addToScene(this.scene);
        }
    }

    posicionar(){

      const posicaoInicial = this.dividendo.mesh.position.clone();
      const posicaoFinal = (this.posicaoFixa)? this.posicaoFixa : this.offsetPosicional.add(posicaoInicial);
      const mover = this.mover(this.dividendo, posicaoInicial, posicaoFinal);

      const posicaoInicial2 = this.divisor.mesh.position.clone();
      const diferencaAltura = this.divisor.length - this.dividendo.length;
      const posicaoFinal2 = new THREE.Vector3(0.2,diferencaAltura/2,0).add(posicaoFinal);
      const mover2 = this.mover(this.divisor, posicaoInicial2, posicaoFinal2);

      const quaternionInicial = this.dividendo.mesh.quaternion.clone();
      const quaternionFinal = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
      const girar = this.girar(this.dividendo, quaternionInicial, quaternionFinal);
      
      const quaternionInicial2 = this.divisor.mesh.quaternion.clone();
      const girar2 = this.girar(this.divisor, quaternionInicial2, quaternionFinal)


      this.posicao1   = posicaoFinal;
      this.posicao2   = posicaoFinal2;
      this.quaternion = quaternionFinal;

      return new AnimacaoSimultanea(mover,girar,mover2,girar2);
    }

    //Agora que os lados estão juntos, fazer a animação da divisão
    //A lógica do algoritmo é a seguinte: 
    //Se o lado divisor for maior, então ele gera um lado 10x menor para ser o novo divisor
    //Senão, o divisor é clonado o número de vezes que ele cabe no dividendo, sobrando o resto
    //Esses clones são sobrepostos de modo a cobrir o dividendo
    dividir(){

        const divisor   = this.divisor.length;
        const dividendo = this.dividendo.length;

        const numero = dividendo/divisor;

        const resto = numero%1;

        const clones = numero - resto;

        const dividir = [];

        for(let i = 0; i < clones; i++){
          
          const copia = this.divisor.mesh.clone();
          const lado = {mesh:copia};

          const altura = divisor*i-(dividendo-divisor)/2

          const posicaoInicial = this.posicao2.clone();

          const posicaoFinal = this.posicao1.clone()
                               .add(new THREE.Vector3(0,altura,0.005))

          const DIVISAO = this;

          const mover =  this.mover(lado, posicaoInicial, posicaoFinal)
                              //Gambiarra para copiar a cor
                             .setUpdateFunction(function(position) {
                                this.objeto.mesh.position.copy(position);
                                this.objeto.mesh.material.color = DIVISAO.divisor.material.color
                             })
                             .setDuration(this.frameCount)
                             .setOnStart(() => {this.scene.add(copia); copia.position.copy(posicaoInicial)})
                             .setOnTermino(() => this.scene.remove(copia)) //Quando terminar execução, deletar copia

          mover.chosen = true;

          console.log(mover)
          
          const direcao = new THREE.Vector3().subVectors(posicaoFinal, posicaoInicial);
          const angulo  = new THREE.Vector3(-1,0,0).angleTo(direcao);
          const rotacao = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), angulo/10);

          const quaternionInicial = this.quaternion.clone(); 
          const quaternionFinal   = this.quaternion.clone().multiply(rotacao);

          const giro1 =  this.girar(lado, quaternionInicial, quaternionFinal).setDuration(this.frameCount/2);
          const giro2 =  this.girar(lado, quaternionFinal, quaternionInicial).setDuration(this.frameCount/2);

          const girar =  new AnimacaoSequencial(giro1,giro2);

          const divisao = new AnimacaoSimultanea(mover,girar);

          dividir.push(divisao);
        }
        const anim = new AnimacaoSequencial(...dividir);

        anim.chosen = true;

        return anim;
    }

    //Animação para mover um lado
    mover(lado, posicaoInicial, posicaoFinal){
      
      //Uma curva de bezier para tornar a animação mais fluida
      const curva = (x) => -(Math.cos(Math.PI * x) - 1) / 2;

      return new Animacao(lado)
                .setValorInicial(posicaoInicial)
                .setValorFinal(posicaoFinal)
                .setInterpolacao(function(inicial,final,peso){
                  return new THREE.Vector3().lerpVectors(inicial,final,curva(peso));
                })
                .setUpdateFunction(function(position){
                  this.objeto.mesh.position.copy(position);
                })
    }

    //Animação para girar um lado
    girar(lado, quaternionInicial, quaternionFinal){

      //Uma curva de bezier para tornar a animação mais fluida
      const curva = (x) => -(Math.cos(Math.PI * x) - 1) / 2;

      return new Animacao(lado)
                .setValorInicial(quaternionInicial)
                .setValorFinal(quaternionFinal)
                .setInterpolacao(function(inicial,final,peso){
                  return new THREE.Quaternion().slerpQuaternions(inicial,final,curva(peso));
                })
                .setUpdateFunction(function(quaternion){
                  this.objeto.mesh.quaternion.copy(quaternion);
                });
    }

    addToScene(scene){
      this.scene = scene;
      return this;
    }
}