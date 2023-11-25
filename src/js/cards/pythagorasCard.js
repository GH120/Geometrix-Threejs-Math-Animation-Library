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

        const trianguloSelecionado = this.outputs.filter(output => output.valido).lenght;

        return trianguloSelecionado;
    }

    process(){

        const triangulo = this.trianguloSelecionado;

        const a = triangulo.edges.reduce((a,b) => a.mesh.length > b.mesh.length);
        const b = triangulo.edges.filter(aresta => aresta != this.a)[0];
        const c = triangulo.edges.filter(aresta => aresta != this.a)[1];

        const equation = new Equality(
                            new Addition(
                                new Square(c.value), 
                                new Square(b.value)
                            ), 
                            new Square(a.value)
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
                                
                                this.estado.valido = estado.dentro && triangulo.retangulo();

                                carta.trianguloSelecionado = triangulo;

                                if(estado.dentro) console.log((this.estado.valido)? "triangulo aceito" : "triangulo rejeitado")
                            })

        triangulo.hoverable.addObserver(verificador);
    }
}