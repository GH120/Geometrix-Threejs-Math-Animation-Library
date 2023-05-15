import * as THREE from 'three';

//Como a lógica geral é só pegar dois lados, seno, cosseno e tangente só mudam o get
export class SenoOnHover {

    constructor(triangulo, angulo){
        this.triangulo = triangulo;
        this.angulo = angulo;
    }

    getHipotenusa(){
        //Retorna a maior aresta das três
        return;
    }

    getAdjacente(){
        //Retorna o cateto 
    }

    getOposto(){
        //Retorna o cateto oposto ao ângulo, ou seja, o único não congruente a ele
    }

    //Só mudando esse daqui dá para instanciar seno,cosseno e tangente
    getRatio(){
        //retorna o lado dividendo e o lado divisor
    }

    addToScene(scene){
        this.scene = scene;
        return this;
    }

    createProp(){
        //Cria uma visualização para o seno como uma animação
        //Inicialmente pensando em adicionar uma transição que pega o cateto oposto e translada ele
        //para a parte direita da tela, com cor (azul?) e fazer o mesmo para a hipotenusa(vermelha?)
        //assim, vai ter uma superposição dos dois lados esticados verticalmente, podendo fazer uma razão geométrica
    }

    onHover(){
        //muda a cor das aréstas do triângulo utilizadas no seno
        //Vermelho hipotenusa, azul o cateto oposto
        //Adicionar nomes dos catetos?
    }
}


//Classe para criar isoceles
//Recebe um vértice para ser o pivô, ou seja, seu ângulo permanece o mesmo
//No entanto, os outros dois são distorcidos de modo a tornar o triângulo isóceles com o menor esforço possível
//Possível animação? Tipo, uma linha pontilhada como a bissetriz do ângulo indo do vértice até a nova aresta oposta?
//Transição fluida entre as posições dos vértices, loop de animação
class CreateIsoceles{

    constructor(triangle){
        this.triangle = triangle;
    }
}

//Classe para desenhar um círculo que contem todos os vértices do triângulo
//Possivelmente criar outro prop círculo?
//Poder criar uma binding que força o triângulo a ficar restringido aos pontos do círculo?
//Animação com um modelo de compasso para tracejar em passos o contorno do círculo
class UnitCircle{
    constructor(triangle){
        this.triangle = triangle;
    }
}

//Uma classe para criar um novo triângulo manualmente, a partir de inputs do usuário
class triangleConstructor{
    
}


//Ideia: possibilidade de mudar plano de fundo para uma situação específica
//Imagine que tem um determinado problema para determinar a sombra de um prédio de altura H sabendo que
//a sombra de um poste de altura h tem comprimento l
//Coloca essa imagem do prédio como plano de fundo, desenha o triângulo fincando dois pontos no prédio e deixando o outro livre
//A sombra do poste vai ter um ângulo dado, o usuário vai poder mecher no vertice livre até o ângulo da sombra do prédio ficar proxima o suficiente

//          |#######|0
//          |       |  \
//          |       |   \
//          |Prédio |    \
//          |       |     \                 I0\
//          |       |sombra\                I  \
//          |       |       \               I   \
//          |       |0  <=== O ===>         I0   0    ângulo theta
//##################################################################################################################

//O = vértice móvel
//0 = vértice fixo
//<=== ===> = direções de movimento