import { Addition, Equality, Square, Value } from "../equations/expressions";

class PythagorasCard {


    constructor(whiteboard){

        this.whiteboard = whiteboard;

        this.a = null;
        this.b = null;
        this.c = null;
    }
    
    accept(triangulo){

        return triangulo.retangulo();
    }

    process(triangulo){

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
}