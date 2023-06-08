export default class FixarAoCirculo{

    constructor(circulo, vertice){
        this.circulo = circulo;
        this.vertice = vertice;
    }

    update(novoEstado){

        this.estado = {...this.estado, ...novoEstado};

        const point = this.estado.position;

        if(!point) return;

        const posicaoNoCirculo = this.posicaoNoCirculo(point);

        this.vertice.position.copy(posicaoNoCirculo);

        this.objeto.update();
    }

    //Pega o sentido do ponto e mapeia para a borda do círculo
    posicaoNoCirculo(point){

        const direcao = point.clone().sub(this.circulo.centro).normalize();

        const deslocamento = direcao.multiplyScalar(this.circulo.raio*(1 - this.circulo.grossura));

        const posicao = this.circulo.centro.clone().add(deslocamento);

        return posicao;
    }
}