import * as THREE from 'three';
import {CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer';

//Como a lógica geral é só pegar dois lados, seno, cosseno e tangente só mudam o get
export class TrigOnHover {

    setTriangulo(triangulo, index){
        this.triangulo = triangulo;
        this.index = (index+1)%3;
        return this;
    }

    get hipotenusa(){

        const Hipotenusa = this.triangulo.edges.reduce((
            edge, longest) => (edge.length < longest.length)? longest : edge, 
            {length:0}
        );

        Hipotenusa.nome = "Hipotenusa";

        return Hipotenusa;
    }

    get adjacente(){
        
        const Hipotenusa = this.hipotenusa;

        const indice = this.index;

        const anterior = this.triangulo.edges[(indice+2)%3];

        const adjacente = [this.triangulo.edges[(indice+1)%3], anterior].filter(lado => lado != Hipotenusa)[0];

        adjacente.nome = "Cateto~adjacente";

        return adjacente;
    }

    get oposto(){
        const indice = this.index;

        const proximo = indice;

        const oposto = this.triangulo.edges[proximo];

        oposto.nome = "Cateto~oposto";

        return oposto;
    }

    //Só mudando esse daqui dá para instanciar seno,cosseno e tangente
    get ratio(){

        //retorna o lado dividendo e o lado divisor
        return this.dividendo.length/this.divisor.length;
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

    onHover(isInside){
        //muda a cor das aréstas do triângulo utilizadas no seno
        //Vermelho hipotenusa, azul o cateto oposto

        if(!this.triangulo.retangulo()) return;

        const dividendo = this.dividendo;
        const divisor   = this.divisor;

        if(isInside){

            dividendo.material = new THREE.MeshBasicMaterial({color:0x0000aa});
            divisor.material   = new THREE.MeshBasicMaterial({color:0x880000});

            if(dividendo == divisor) dividendo.material = new THREE.MeshBasicMaterial({color:0x8800aa});
        }
        else{
            dividendo.material = new THREE.MeshBasicMaterial({ color: 0xe525252 });
            divisor.material   = new THREE.MeshBasicMaterial({ color: 0xe525252 });
        }

        this.updateEquacao(isInside);
    }

    updateEquacao(isInside){

        const scene = this.triangulo.scene; 

        if(!scene) return;

        scene.remove(this.equation);

        const vertice = this.triangulo.vertices[(this.index+2)%3];

        const angulo = this.triangulo.angles[(this.index+2)%3];

        const deslocamento = new THREE.Vector3(0,0,0).lerpVectors(angulo.vetor1, angulo.vetor2, 0.5).multiplyScalar(2);

        const position = vertice.position.clone().add(deslocamento)

        const latex = `$$ \\${this.name}(${Math.round(angulo.degrees)}°) = 
                            \\frac{
                                \\color{blue}{${this.dividendo.nome}}
                            }
                            {
                                \\color{red}{${this.divisor.nome}}
                            }

                            =
                            \\frac{
                                \\color{blue}{${this.dividendo.length}}
                            }
                            {
                                \\color{red}{${this.divisor.length}}
                            }
                            = \\color{purple}{${this.ratio}}
                        $$`;


        const equation  = this.triangulo.createText(latex, position);

        this.equation = equation;

        //Carrega o Latex
        MathJax.Hub.Queue(function() {
            const element = equation.element;
            MathJax.Hub.Typeset([element]);
        });

        if(isInside) scene.add(this.equation);
        
    }

    update(){
        this.dividendo.update();
        this.divisor.update();
    }
}

export class SenoOnHover extends TrigOnHover{

    constructor(){
        super();
        this.name = "sin";
    }

    get dividendo(){
        return this.oposto;
    }

    get divisor(){
        return this.hipotenusa
    }
}

export class CossenoOnHover extends TrigOnHover{

    constructor(){
        super();
        this.name = "cos";
    }

    get dividendo(){
        return this.adjacente;
    }

    get divisor(){
        return this.hipotenusa
    }

    onHover(isInside){
        const angle = this.triangulo.angles[(this.index+2)%3];

        if(Math.abs(angle.angulo-Math.PI/2) < 0.001) return;

        super.onHover(isInside);
    }
}

export class TangenteOnHover extends TrigOnHover{

    constructor(){
        super();
        this.name = "tan";
    }

    get dividendo(){
        return this.oposto;
    }

    get divisor(){
        return this.adjacente;
    }

    onHover(isInside){
        const angle = this.triangulo.angles[(this.index+2)%3];

        if(Math.abs(angle.angulo-Math.PI/2) < 0.001) return;

        super.onHover(isInside);
    }
}


//Classe para criar isoceles
//Recebe um vértice para ser o pivô, ou seja, seu ângulo permanece o mesmo
//No entanto, os outros dois são distorcidos de modo a tornar o triângulo isóceles com o menor esforço possível
//Possível animação? Tipo, uma linha pontilhada como a bissetriz do ângulo indo do vértice até a nova aresta oposta?
//Transição fluida entre as posições dos vértices, loop de animação
class CreateIsoceles{

    constructor(triangulo){
        this.triangulo = triangulo;
    }
}

//Classe para desenhar um círculo que contem todos os vértices do triângulo
//Possivelmente criar outro prop círculo?
//Poder criar uma binding que força o triângulo a ficar restringido aos pontos do círculo?
//Animação com um modelo de compasso para tracejar em passos o contorno do círculo
class UnitCircle{
    constructor(triangulo){
        this.triangulo = triangulo;
    }
}

//Uma classe para criar um novo triângulo manualmente, a partir de inputs do usuário
class trianguloConstructor{
    
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


//Transição entre a animação 3d do modelo do prédio com a visualização 3d


//Ideia: um texto do problema iterativo, no estilo de um puzzle. 
//As palavras chave poderiam brilhar onHover e criar uma visualização do problema