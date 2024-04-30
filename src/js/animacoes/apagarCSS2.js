import Animacao from "./animation";


export const apagarCSS2 = (texto, scene) => new Animacao()
                                        .setValorInicial(1)
                                        .setValorFinal(0)
                                        .setInterpolacao((a,b,c) => a*(1-c) + b*c)
                                        .setUpdateFunction(function(valor){
                                            texto.element.style.opacity = valor;

                                        })
                                        .voltarAoInicio(false)
                                        .setOnTermino(() => scene.remove(texto))
                                        .setDuration(30)