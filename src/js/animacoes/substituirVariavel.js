import MostrarTexto from "./MostrarTexto";
import { AnimacaoSequencial } from "./animation";

export const substituirVariavel = (variavel, valor) => 
    new AnimacaoSequencial(
        new MostrarTexto(variavel)
        .reverse()
        .setOnTermino(() => variavel.element.textContent = valor),
        new MostrarTexto(variavel)
    )
    .setCheckpointAll(false)
    
