import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {CSS2DObject, CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer';
import {SenoOnHover, CossenoOnHover, TangenteOnHover} from './handlers/trigonometry';
import {Animacao} from './animacoes/animation';
import {Divisao} from './animacoes/divisao';
import { Draggable } from './controles/draggable';
import MoverVertice from './handlers/moverVertice';
import {Programa} from './programa';
import Circle from './objetos/circle';


import {Triangle} from './objetos/triangle';
import grid from '../assets/grid.avif';
import * as dat from 'dat.gui';

//Adicionar interface de colisão => hover.objeto = objeto, hover.objeto.hitbox -> angulo.hitbox returns angulo.mesh
//triangulo.hitbox = new Plane().setPosition(triangulo.center)

//setup Threejs
const scene = new THREE.Scene();
const width = window.innerWidth;
const height = window.innerHeight;

const canvas = document.getElementById('triangulo');
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({ canvas, antialias:true });
renderer.setSize( window.innerWidth, window.innerHeight );

camera.position.z = 5;

scene.background = new THREE.TextureLoader().load(grid);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.body.appendChild(labelRenderer.domElement);

//Cria o triângulo e o programa
const triangle = new Triangle()
                    .renderVertices()
                    .renderEdges()
                    .renderAngles()
                    .addToScene(scene);

const circle = new Circle(new THREE.Vector3(-1.5,-1.5,0), 2.17,0.05);

const programa = new Programa(triangle,scene,camera);

programa.adicionarCirculo(circle);

////////////////////////////Interfáce gráfica/////////////////////////////////////
const gui = new dat.GUI();

//Configurações
const options = {
  "tamanho da esfera": 0.1,
  "grossura": 0.05,
  "raio do ângulo": 0.7,
  "atualizar": false,
  "duração da animação":90,

  mudarFuncaoTrigonometrica: {
      toggleFunction: function() { 
        button.name(`Mostrando ${programa.mudarFuncaoTrigonometrica().estado.nome}`);
      }
  }
};

//Atualizar configurações
function attOptions() {
  triangle.edges.map(edge => edge.grossura = options.grossura);
  triangle.sphereGeometry = new THREE.SphereGeometry(options["tamanho da esfera"]);
  triangle.angles.map(angle => angle.angleRadius = options["raio do ângulo"])
}

//Botões da interface
gui.add(options, 'grossura', 0.01, 0.2).onChange( () => triangle.update());
gui.add(options, 'tamanho da esfera', 0.1, 2).onChange( () => triangle.update());
gui.add(options, 'raio do ângulo', 0.05, 3).onChange( () => triangle.update());
gui.add(options, "duração da animação",45,600).onChange((value) => {divisao.setDuration(value); divisao.delay = value/2})
gui.add( {onClick: () => programa.trigonometria.map(trig => trig.animando = !trig.animando)}, 'onClick').name('Mostrar animação de divisão');
gui.add( {onClick: () => options.atualizar = !options.atualizar}, 'onClick').name('atualizar todo frame');
let button = gui.add(options.mudarFuncaoTrigonometrica, 'toggleFunction').name('Mostrando nada');
////////////////////////////////////////////////////////////////////////////////////

//Exemplos de animações, depois refatorar
const mudarCor = new Animacao(triangle.angles[1])
                    .setValorInicial(0x000000)
                    .setValorFinal(0x0000ff)
                    .setDuration(300)
                    .setInterpolacao(function(inicial,final,peso){
                      return( inicial*(1-peso)*(1-peso)*(1-peso) + final*peso*peso*peso);
                    })
                    .setUpdateFunction(function(valor){
                      this.objeto.sectorMaterial = new THREE.MeshBasicMaterial({color:valor});
                      this.objeto.update();
                    });

const curva = (x) => -(Math.cos(Math.PI * x) - 1) / 2;

//Animação para criar círculo
const criarCirculo = new Animacao(circle)
                     .setValorInicial(0)
                     .setValorFinal(360)
                     .setDuration(300)
                     .setInterpolacao(function(inicial, final, peso){
                        return inicial*(1-curva(peso)) + final*curva(peso);
                     })
                     .setUpdateFunction(function(angulo){
                        scene.remove(this.objeto.mesh);

                        this.objeto.construirMesh(angulo);

                        this.objeto.update();
                        
                        scene.add(this.objeto.mesh);
                     });

//Animação para linearizar círculo
const coordenadas = circle.getPontos(360);

const posicaoInicial = coordenadas.map((eixo, i) => new THREE.Vector3(coordenadas[i], 
                                                                      coordenadas[i+1], 
                                                                      coordenadas[i+2]))
                                  .filter((vetor, i) => i%3 == 0)
                                  .map(vetor => vetor.multiplyScalar(circle.raio))

const pontoInterior = (i) =>  new THREE.Vector3(Math.PI*(Math.floor(i/6)*2/360-1),circle.grossura,0);

const pontoExterior = (i) =>  new THREE.Vector3(Math.PI*(Math.floor(i/6)*2/360-1) ,      0       ,0);

const posicaoFinal = posicaoInicial.map((vetor, i) => (i%6 == 0)? pontoInterior(i-7) : 
                                                      (i%6 == 1)? pontoExterior(i-7) :
                                                      (i%6 == 2)? pontoInterior(i): 
                                                      (i%6 == 4)? pontoExterior(i) : 
                                                      (i%6 == 5)? pontoExterior(i+7) :
                                                      (i%6 == 3)? pontoInterior(i): null
                                                      )
                                   .map(vetor => vetor.multiplyScalar(circle.raio))
                                   .map(vetor => vetor.sub(circle.centro));

//Add a fading effect to the triangles as they are placed
//Maybe create a 'dotted line' class?
//On hover, they would showcase each 
const linearizarCirculo = new Animacao(circle)
                          .setValorInicial(posicaoInicial)
                          .setValorFinal(posicaoFinal)
                          .setDuration(200)
                          .setInterpolacao(function(inicial,final,peso){
                            return inicial.map((vetor,i) => new THREE.Vector3().lerpVectors(vetor,final[i], curva(peso)));
                          })
                          .setUpdateFunction(function(pontos){

                            scene.remove(this.objeto.mesh);

                            const coordenadas = [].concat(...pontos.map(ponto => ponto.toArray()));

                            const geometry = new THREE.BufferGeometry();

                            geometry.setAttribute('position', new THREE.Float32BufferAttribute(coordenadas,3));

                            this.objeto.mesh = new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:0x00ff00}));

                            this.objeto.update();

                            scene.add(this.objeto.mesh);
                          });

const gerarCicloTrigonometrico = new Animacao(circle)
                                 .setValorInicial(0)
                                 .setValorFinal(2*Math.PI)
                                 .setDuration(300)
                                 .setInterpolacao((a,b,p) => b*p)
                                 .setUpdateFunction(function(angulo){

                                    if(Math.round(angulo*180/Math.PI)%15 != 0) return;
                                    
                                    const novoTriangulo = new Triangle();
                                    novoTriangulo.sphereGeometry = new THREE.SphereGeometry(0.04);

                                    const centro = circle.centro.toArray();
                                    
                                    novoTriangulo.positions = [[0,0,0],
                                                               [Math.cos(angulo), 0, 0],
                                                               [Math.cos(angulo), Math.sin(angulo), 0]]
                                                               .map(position => position.map(eixo => eixo*circle.raio))
                                                               .map(position => position.map((eixo,i) => eixo + centro[i]))

                                    // novoTriangulo.positions.map(position => position.map)

                                    novoTriangulo
                                    .renderVertices()
                                    .renderEdges()
                                    .renderAngles()
                                    .addToScene(scene);

                                    novoTriangulo.angles.map(angle => angle.angleRadius = 0.1);
                                    novoTriangulo.edges.map(edge => edge.grossura = 0.03)
                                    
                                    novoTriangulo.renderVertices();

                                    novoTriangulo.update();
                                 });

//Adiciona as animações ao programa
// programa.animar(Animacao.sequencial(criarCirculo, linearizarCirculo));
programa.animar(mudarCor);
programa.animar(Animacao.simultanea(gerarCicloTrigonometrico, criarCirculo))

console.log(programa)

//Loop de animação
function animate() {
    requestAnimationFrame( animate );
    attOptions();

    programa.frames.map(frame => frame.next()); //Roda as animações do programa

    if(options.atualizar) triangle.update();

    renderer.render( scene, camera );
    labelRenderer.render( scene, camera );
}
animate();

window.addEventListener('resize', function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
});
  