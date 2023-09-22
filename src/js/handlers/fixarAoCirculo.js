import { Handler } from './handler';

export default class FixarAoCirculo extends Handler{

    constructor(circulo, vertice){
        super();
        this.circulo = circulo;
        this.vertice = vertice;
    }

    update(novoEstado){

        this.estado = {...this.estado, ...novoEstado};

        const point = this.estado.position;

        if(!point) return;

        const posicaoNoCirculo = this.posicaoNoCirculo(point);

        console.log(this.vertice,point)

        this.vertice.moveTo(posicaoNoCirculo);

        // this.circulo.update();
    }

    //Pega o sentido do ponto e mapeia para a borda do círculo
    posicaoNoCirculo(point){

        const direcao = point.clone().sub(this.circulo.position).normalize();

        const deslocamento = direcao.multiplyScalar(this.circulo.raio*(1 - this.circulo.grossura));

        const posicao = this.circulo.position.clone().add(deslocamento);

        return posicao;
    }
}