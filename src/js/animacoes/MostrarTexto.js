import Animacao from "./animation";

//Menos reliable que o TextoAparecendo, usar com cautela
export default class MostrarTexto extends Animacao{


    /**Aceita elementos css2d, se passar a cena adiciona o elemento a ela no setOnStart */
    constructor(texto, scene=null){

        super(texto);

        this.setDuration(200);

        this.setValorInicial(0);
        this.setValorFinal(500);
        this.setInterpolacao((inicial,final,peso) => inicial*(1-peso) + final*peso)

        this.setCurva(x => -(Math.cos(Math.PI * x) - 1) / 2)
        this.voltarAoInicio(false);

        if(scene) this.setOnStart(() => scene.add(texto));
    }

    update(comprimentoApagado){

        this.objeto.element.style.clipPath = `xywh(0% 0px ${comprimentoApagado}px 100% round 0% 0)`

    }
}