import Animacao from "./animation";

export const engrossarLado = (lado) =>  new Animacao()
                                        .setValorInicial(lado.grossura)
                                        .setValorFinal(lado.grossura * 1.3)
                                        .setInterpolacao((a,b,c) => a*(1-c) + b*c)
                                        .setDuration(200)
                                        .voltarAoInicio(true)
                                        .setCurva(x => {

                                            x = Math.abs(Math.sin(4.5*x*Math.PI)); //Vai e volta
                                            
                                            const c1 = 1.70158;
                                            const c2 = c1 * 1.525;

                                            return x < 0.5
                                            ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
                                            : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
                                        })
                                        .setUpdateFunction(function(valor){
                                            lado.grossura = valor;
                                            lado.update();
                                        })
                                        .setOnTermino(function(){
                                            lado.grossura = this.valorInicial;
                                            lado.update();
                                        })