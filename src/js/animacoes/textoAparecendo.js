import Animacao from "./animation";

export class TextoAparecendo extends Animacao{

    constructor(texto){
        super(texto);
        this.valorInicial    = -10;
        this.valorFinal      = texto.children.length*2;
        this.setDuration(200);
        this.voltar = false;
    }

    interpolacao(inicial, final, peso){

        const curva = (x) =>  x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;

        peso = curva(peso);

        return inicial*(1-peso) + final*peso;
    }

    update(valor){

        const letrasAmount = 5;

        const curva = (x) =>  x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;

        let index = 0;

        for(const child of this.objeto.children){
            if(index < valor){
                child.style.color = `rgba(0,0,0,1)`
            }
            else{
                child.style.color = `rgba(0,0,0,${curva(Math.max(0, (valor+letrasAmount-index)/letrasAmount))})`
            }

            index++;
        }
    }
}