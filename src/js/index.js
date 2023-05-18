import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {CSS2DObject, CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer';
import {SenoOnHover, CossenoOnHover, TangenteOnHover} from './controles/trigonometry';
import {Animacao} from './animacoes/animation';

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

//Cria o triângulo
const triangle = new Triangle()
                    .renderVertices()
                    .renderEdges()
                    .renderAngles()
                    .createControlers(camera)
                    .addToScene(scene);


////////////////////////////Interfáce gráfica/////////////////////////////////////
const gui = new dat.GUI();

let guiControls = {
  trigFunction: 'default',
  toggleFunction: function() {

    let funcaoOnHover;

    if (guiControls.trigFunction === 'seno') {
      guiControls.trigFunction = 'cosseno';
      button.name('Mostrando cosseno');
      funcaoOnHover = CossenoOnHover;
    } else if(guiControls.trigFunction === 'cosseno'){
      guiControls.trigFunction = 'tangente';
      button.name('Mostrando tangente');
      funcaoOnHover = TangenteOnHover;
    }
    else if(guiControls.trigFunction === 'tangente'){
      guiControls.trigFunction = 'default';
      button.name('Mostrando nada');
      funcaoOnHover = null;
    }
    else{
      guiControls.trigFunction = 'seno';
      button.name('Mostrando seno');
      funcaoOnHover = SenoOnHover;
    }

    if(funcaoOnHover != null) 
      triangle.hoverable.map((hover,index) => hover.observers[1] = (new funcaoOnHover().setTriangulo(triangle, index)));

    else
      triangle.hoverable.map((hover,index) => hover.observers[1] = null)

    console.log(triangle.hoverable);
  }
};


const options = {
  "tamanho da esfera": 0.1,
  "grossura": 0.05,
  "raio do ângulo": 0.7,
  "atualizar": false
};

gui.add(options, 'grossura', 0.01, 0.2).onChange( () => triangle.update());
gui.add(options, 'tamanho da esfera', 0.1, 2).onChange( () => triangle.update());
gui.add(options, 'raio do ângulo', 0.05, 3).onChange( () => triangle.update());

// gui.add({onClick: () => options.atualizar = !options.atualizar},'onClick').nome("atualizar todo frame")

const buttonProperties = {
  onClick: () => options.atualizar = !options.atualizar
};

// Step 3: Add the button to the GUI
gui.add( {onClick: () => options.atualizar = !options.atualizar}, 'onClick').name('atualizar todo frame');
let button = gui.add(guiControls, 'toggleFunction');
button.name("Mostrando nada")

function attOptions() {
  triangle.grossura = options.grossura;
  triangle.sphereGeometry = new THREE.SphereGeometry(options["tamanho da esfera"]);
  triangle.angles.map(angle => angle.angleRadius = options["raio do ângulo"])
}
////////////////////////////////////////////////////////////////////////////////////

//Exemplos de animações
const mudarCor = new Animacao(triangle.angles[1])
                    .setValorInicial(0x000000)
                    .setValorFinal(0x0000ff)
                    .setDuration(300)
                    .setInterpolacao(function(inicial,final,peso){
                      // console.log(inicial,final,peso)
                      return( inicial*(1-peso)*(1-peso)*(1-peso) + final*peso*peso*peso);
                    })
                    .setUpdateFunction(function(valor){
                      this.objeto.sectorMaterial = new THREE.MeshBasicMaterial({color:valor});
                      console.log(valor);
                      this.objeto.update();
                    });


const mover = new Animacao(triangle.edges[0])
                  .setValorInicial(new THREE.Vector3(3,1.5,0))
                  .setValorFinal(new THREE.Vector3(-5,1.5,0))
                  .setDuration(3000)
                  .setInterpolacao(function(inicial,final,peso){
                    return new THREE.Vector3(0,0,0).lerpVectors(inicial,final,peso);
                  })
                  .setUpdateFunction(function(valor){
                    console.log(valor)
                    this.objeto.mesh.position.copy(valor)
                  });

const frames1 = mover.getFrames();
const frames2 = mudarCor.getFrames();


//Loop de animação
function animate() {
    requestAnimationFrame( animate );
    // frames1.next();
    // frames2.next();
    attOptions();
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
  