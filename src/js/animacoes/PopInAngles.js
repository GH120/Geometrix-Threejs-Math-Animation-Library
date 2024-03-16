import Animacao from "./animation";

export const PopInAngles = (angle) => new Animacao()
                            .setValorInicial(0)
                            .setValorFinal(angle.angleRadius)
                            .setInterpolacao((i,f,peso) => i*(1-peso) + f*peso)
                            .setUpdateFunction((valor) => {

                                const scene = angle.mesh.parent;

                                angle.angleRadius = valor;
                                angle.removeFromScene()
                                angle.render();
                                angle.addToScene(scene);
                            })
                            .setCurva(x => {
                                const c4 = (2 * Math.PI) / 3;

                                return x === 0
                                ? 0
                                : x === 1
                                ? 1
                                : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
                            })
                            .setDuration(100)
                            .setProgresso(0)
                            .voltarAoInicio(false)