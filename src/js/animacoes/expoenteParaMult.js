import Animacao, { AnimacaoSequencial, AnimacaoSimultanea } from "./animation";
import { TextoAparecendo } from "./textoAparecendo";

export class ExpoenteParaMult extends Animacao{

    constructor(element, base, expoente){

        super();

        this.element  = element;
        this.base     = base;
        this.expoente = expoente;

        this.quebrar(expoente);
        this.quebrar(base);

        base.style.position = "relative"

    }

    //Gambiarra, consertar parte do mostrar texto
    quebrar(element){
        const letters = element.textContent.split('');

        element.textContent = '';

        letters.map(letter => {
            const span = document.createElement("span");

            span.textContent = letter;

            element.appendChild(span)
        })
    }

    moverBase(){

        //Gambiarra pra enganar o css, aumenta o tamanho do container da base
        const filler = document.createElement("span");

        filler.style.display = "inline-block";
        filler.style.width = "1px";
        filler.style.height = "1px";
        filler.style.color = "white"

        //Copia o valor da base 
        const copia = document.createElement("span");
        
        copia.textContent = this.base.textContent;
        
        copia.style.position = "absolute";
        
        const length = copia.textContent.length;


        //caractere de multiplicação *
        const mult = document.createElement("span")

        mult.textContent = "⋅"

        mult.style.position = "absolute"

        this.quebrar(mult)

        const mostrarMult = new TextoAparecendo(mult)
                            .setValorInicial(-10)
                            .setOnStart(() => {
                                this.base.appendChild(mult)
                            })
        
        const posicionarCopia = new Animacao(copia)
                                .setValorInicial(4)
                                .setValorFinal(15 + 11*length)
                                .setDuration(120)
                                .setInterpolacao(function(inicial,final,peso){
                                    return inicial*(1-peso) + final*peso;
                                })
                                .setUpdateFunction(function(valor){
                                    copia.style.left = `${valor}px`

                                    filler.style.width = `${Math.round(valor)}px`
                                })
                                .setOnStart(() => {this.base.appendChild(copia); this.base.appendChild(filler)})
                                .voltarAoInicio(false)

        return new AnimacaoSimultanea(mostrarMult, posicionarCopia);
    }

    *getFrames(){

        const desaparecerExpoente = new TextoAparecendo(this.expoente)
                                        .setValorInicial(4)
                                        .setValorFinal(-20);

        //Gambiarra pra ter delay antes da execução
        const fillerFrames = new TextoAparecendo(this.expoente)
                                .setUpdateFunction(() => null)
                                .setDuration(40);

        yield* new AnimacaoSimultanea(desaparecerExpoente, new AnimacaoSequencial(fillerFrames, this.moverBase())).getFrames()
    }
}