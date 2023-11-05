import Animacao from "./animation";
import * as THREE from 'three'

const curva = (x) => 255* (-(Math.cos(Math.PI * x/255) - 1) / 2);

export const colorirAngulo = (angulo) =>    new Animacao(angulo)
                                                .setValorInicial(0x00f00a)
                                                .setValorFinal(0x0f00ff)
                                                .setDuration(300)
                                                .setInterpolacao(function (color1, color2, weight) {
                                                    const r1 = (color1 >> 16) & 0xff;
                                                    const g1 = (color1 >> 8) & 0xff;
                                                    const b1 = color1 & 0xff;
                                                    
                                                    const r2 = (color2 >> 16) & 0xff;
                                                    const g2 = (color2 >> 8) & 0xff;
                                                    const b2 = color2 & 0xff;
                                                    
                                                    const r = Math.round(curva(r1 + weight * (r2 - r1)));
                                                    const g = Math.round(curva(g1 + weight * (g2 - g1)));
                                                    const b = Math.round(curva(b1 + weight * (b2 - b1)));
                                                    
                                                    return (r << 16) | (g << 8) | b;
                                                })
                                                .setUpdateFunction(function(valor){
                                                    this.objeto.material = new THREE.MeshBasicMaterial({color:valor});
                                                    this.objeto.update();
                                                });