import * as THREE from 'three';
import {Animacao} from './animation';

export class Divisao extends Animacao{

    constructor(lado1, lado2){
        super();
        this.dividendo = lado1;
        this.divisor = lado2;
        this.frames = 90;
        this.delay = 45;
        this.dividir();
    }

    //Cria as animações a serem usadas
    animar(){

      const posicaoInicial = this.dividendo.mesh.position.clone();
      const posicaoFinal = new THREE.Vector3(3,0,0).add(posicaoInicial);
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
      
      this.animations = [mover,girar,mover2,girar2];

      return this;
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

    //Agora que os lados estão juntos, fazer a animação da divisão
    //A lógica do algoritmo é a seguinte: 
    //Se o lado divisor for maior, então ele gera um lado 10x menor para ser o novo divisor
    //Senão, o divisor é clonado o número de vezes que ele cabe no dividendo, sobrando o resto
    //Esses clones são sobrepostos de modo a cobrir o dividendo
    dividir(){

        let numero = 0;

        let divisor   = this.divisor.length;
        let dividendo = this.dividendo.length;

        for(let i = 0; i < 10; i++){

            const clones = dividendo/divisor;

            const potencia = 10 ** -i;

            numero += (clones - clones%1) * potencia;

            dividendo = dividendo%divisor;
            divisor   /= 10;

            //Yield a clone, dividendo, divisor
        }
    }

    turno(numeroDeClones, numero, dividendo, divisor){

      //Torna o tamanho do divisor para o seu novo tamanho
      //Cria o numeroDeClones do lado divisor, de tamanho divisor
      //Mapeia cada um para adicionar a cena
      //Vai criar uma animação para cada um para ir de sua posição original a posição de altura h
      //h vai ser a altura atingida até aquele ponto(this.dividendo.length-dividendo) + n*divisor, onde n é o número do clone
      //Retorna o array das animações
    }

    *getFrames(){

        this.dividir();

        this.animations.map(animation => animation.setDuration(this.frames));

        const action = this.animations.map(animation => animation.getFrames());

        //Muda cada ação individual a cada frame
        for(let i =0; i < this.frames; i++){
            yield action.map(action => action.next());
        }

        //Mantém o resultado final da animação em estado de inércia
        for(let i=0; i < this.delay; i++){
            yield this.animations.map(animation => animation.manterExecucao());
        }

        //Volta a animação ao estado inicial, como se nada tivesse acontecido
        yield this.animations.map(animation => animation.terminarExecucao());
    }
}