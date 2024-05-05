import { TextoAparecendo } from "../animacoes/textoAparecendo";
import { Addition, Equality, Square, Value } from "../equations/expressions";
import { Hoverable } from "../inputs/hoverable";
import { Output } from "../outputs/Output";

export class LadoParalogramo {


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

        const triangulos = fase.objetos;

        for(const triangulo of triangulos){

            //Por algum motivo, precisa sempre criar novos outputs

            if(!triangulo.hoverable){
                new Hoverable(triangulo, fase.camera);
            }

            // if(!this.verificadorDeHover)
                this.criarVerificadorDeHover(triangulo, fase.scene, fase.camera);
        }
    }
    
    accept(){

        const trianguloValido    = this.outputs.filter(output => output.estado.valido);

        const trianguloRetangulo = trianguloValido.length;

        alert(`Triangulo ${(trianguloValido.length)? "encontrado" : "não encontrado"}`);

        alert(`Triangulo ${trianguloRetangulo? "retângulo: ACEITO" : "não retângulo: REJEITADO"}`);

        return trianguloRetangulo;
    }

    process(){

        const triangulo = this.trianguloSelecionado;

        const a = triangulo.edges.reduce((a,b) => (a.length > b.length? a : b))
        const b = triangulo.edges.filter(aresta => aresta != this.a)[0];
        const c = triangulo.edges.filter(aresta => aresta != this.a)[1];

        console.log("lados", a,b,c, triangulo)

        if(!a.valor || !b.valor || !c.valor) throw new Error("Lados do triângulo não tem valores, tente outra fase")

        const equation = new Equality(
                            new Addition(
                                new Square(c.valor), 
                                new Square(b.valor)
                            ), 
                            new Square(a.valor)
                        )

        // const aparecerEquacao = new TextoAparecendo(equation.element);
        

        // aparecerEquacao.setDuration(100);
        // aparecerEquacao.valorInicial(-2);
        // aparecerEquacao.valorFinal(3);

        this.whiteboard.adicionarEquacao(equation);
        
        this.whiteboard.animar( 
                new TextoAparecendo(equation.element)
                .setValorInicial(-5)
                .setValorFinal(1)
                .setCurva(x => -(Math.cos(Math.PI * x) - 1) / 2)
        );

        this.a = a;
        this.b = b;
        this.c = c;
    }

    criarVerificadorDeHover(triangulo, scene, camera){

        const carta = this;

        const verificador = new Output()
                            .setUpdateFunction(function(estado){

                                const trianguloRenderizado = triangulo.renderedInScene();

                                this.estado.valido = estado.dentro && trianguloRenderizado;

                                carta.trianguloSelecionado = triangulo;

                            })
                            .addInputs(triangulo.hoverable);

        this.outputs.push(verificador);

        this.verificadorDeHover = verificador; 
    }
}