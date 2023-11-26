import { Addition, Equality, Square, Value } from "../equations/expressions";
import { Hoverable } from "../inputs/hoverable";
import { Output } from "../outputs/Output";

export class PythagorasCard {


    constructor(whiteboard){

        this.whiteboard = whiteboard;

        this.a = null;
        this.b = null;
        this.c = null;

        this.outputs = [];
    }

    //Quando a carta for arrastada, pega os triângulos da scene
    //Torna eles hoverable e adiciona um output quando estiverem em cima
    trigger(fase){

        const triangulos = fase.objetos.filter(objeto => objeto.constructor.name == "Triangle");

        for(const triangulo of triangulos){

            new Hoverable(triangulo, fase.camera);

            this.verificarHover(triangulo, fase.scene, fase.camera);
        }
    }
    
    accept(){

        const trianguloValido = this.outputs.filter(output => output.estado.valido);

        console.log("processado")

        console.log(trianguloValido)

        console.log(trianguloValido[0].estado.valido)

        return trianguloValido.length;
    }

    process(){

        const triangulo = this.trianguloSelecionado;

        const a = triangulo.edges.reduce((a,b) => (a.length > b.length? a : b))
        const b = triangulo.edges.filter(aresta => aresta != this.a)[0];
        const c = triangulo.edges.filter(aresta => aresta != this.a)[1];

        console.log("lados", a,b,c, triangulo)

        const equation = new Equality(
                            new Addition(
                                new Square(c.valor), 
                                new Square(b.valor)
                            ), 
                            new Square(a.valor)
                        )

        this.whiteboard.adicionarEquacao(equation);

        this.a = a;
        this.b = b;
        this.c = c;
    }

    verificarHover(triangulo, scene, camera){

        const carta = this;

        const verificador = new Output()
                            .setUpdateFunction(function(estado){

                                this.estado.valido = estado.dentro;

                                console.log("sim", this.estado)

                                carta.trianguloSelecionado = triangulo;

                            })

        triangulo.hoverable.addObserver(verificador);

        this.outputs.push(verificador)
    }
}