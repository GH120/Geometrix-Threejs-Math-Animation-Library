import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {CSS2DObject, CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer';
import {SenoOnHover, CossenoOnHover, TangenteOnHover} from './handlers/trigonometry';
import Animacao, { AnimacaoSimultanea , AnimacaoSequencial} from './animacoes/animation';
import {Divisao} from './animacoes/divisao';
import { Draggable } from './controles/draggable';
import MoverVertice from './handlers/moverVertice';
import {Programa} from './programa';
import Circle from './objetos/circle';
import {Triangle} from './objetos/triangle';
import grid from '../assets/grid.avif';
import * as dat from 'dat.gui';
import Circunscrever from './animacoes/circunscrever';
import {Tracejado} from './objetos/Tracejado';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MultipleClickable } from './controles/clickable';
import { Fase } from './fases/fase1';

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

const directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
scene.add( directionalLight );
const light = new THREE.AmbientLight( 0x606060 ); // soft white light
scene.add( light );

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

const programa = new Fase(triangle,scene,camera);

const circle = new Circle(new THREE.Vector3(-1.5,-1.5,0), 2.17,0.05);

circle.circunscrever(triangle);

const loader = new OBJLoader();


//Lições aprendidas: o parcel precisa de uma configuração parcelrc
//Essa configuração irá mudar os transformers para compilar o .obj
//Pode-se obter o path para tal arquivo com um require
// const path =  require("../assets/compasso.obj");

// loader.load(
//   path,
//   function(objeto){
//     scene.add(objeto);
//     objeto.hitbox = objeto;
//     objeto.scale.set(0.0007,0.0007,0.0007)
//     //cilindro superior => 9
//     //Cabeçote => 13
//     //Ponta direita child 472
//     //Ponta esquerda child 499

//     //Perna direita

//     const cabecote = objeto.children.slice(0,440);
//     const pernaDireita = [objeto.children[19]].concat(objeto.children.slice(440, 482));
//     const pernaEsquerda = [objeto.children[18]].concat(objeto.children.slice(482));

//     //Eu sei que a ponta esquerda vai estar na posição do centro do círculo
//     const posicao = new THREE.Vector3(0.25,1.5,0);
//     const deslocamento = new THREE.Vector3(-1.5,-1.5,0).sub(posicao);
//     objeto.position.sub(deslocamento)

//     new Draggable(objeto, camera).addObserver(new MoverVertice({update:() =>null}, objeto))
//     new MultipleClickable(objeto.children.map(child => ({hitbox:child})), camera).addObserver({update: estado => console.log(estado)});
//   }
// )

directionalLight.lookAt(triangle.vertices[0]);

////////////////////////////////////////////////////////////////////////////////////

//Exemplos de animações, depois refatorar
const mudarCor = new Animacao(triangle.angles[1])
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
                      
                        const r = Math.round(r1 + weight * (r2 - r1));
                        const g = Math.round(g1 + weight * (g2 - g1));
                        const b = Math.round(b1 + weight * (b2 - b1));
                      
                        return (r << 16) | (g << 8) | b;
                    })
                    .setUpdateFunction(function(valor){
                      this.objeto.sectorMaterial = new THREE.MeshBasicMaterial({color:valor});
                      this.objeto.update();
                    });

const curva = (x) => -(Math.cos(Math.PI * x) - 1) / 2;

//Animação para criar círculo
const criarCirculo = new Circunscrever(triangle,scene)

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
const linearizarCirculo = new Animacao(criarCirculo.circulo)
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
                          })
                          .voltarAoInicio(false);

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

                                    novoTriangulo.renderEdges = function(){
                                      this.edges = this.vertices.map((vertex,index) => new Tracejado(vertex.position.clone(), this.vertices[(index+1)%3].position.clone(),0.02));
                                      return this;
                                    } 

                                    novoTriangulo
                                    .renderVertices()
                                    .renderEdges()
                                    .renderAngles()
                                    .addToScene(scene);

                                    novoTriangulo.edges.map(edge => edge.material = new THREE.MeshBasicMaterial({color:0x808080}))

                                    console.log(novoTriangulo)

                                    novoTriangulo.angles.map(angle => angle.angleRadius = 0.1);
                                    novoTriangulo.edges.map(edge => edge.grossura = 0.03)
                                    
                                    novoTriangulo.renderVertices();

                                    novoTriangulo.update();
                                 });


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// Possiveis ações/animações que o programa roda///////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// programa.adicionarCirculo(criarCirculo.circulo)
//Adiciona as animações ao programa
// programa.animar(new AnimacaoSequencial(criarCirculo, linearizarCirculo));
// programa.animar(mudarCor);
// circle.centro = new THREE.Vector3(-1.7,-1.7,0);
// criarCirculo.circulo.centro = circle.centro;
// programa.animar(new AnimacaoSimultanea(gerarCicloTrigonometrico, criarCirculo))
// programa.animar(criarCirculo);

console.log(programa)

//Loop de animação
function animate() {
    requestAnimationFrame( animate );

    //Atualiza o programa
    programa.update();

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
  