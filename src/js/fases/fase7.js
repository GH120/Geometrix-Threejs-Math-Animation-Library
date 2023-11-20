import {Draggable} from '../inputs/draggable';
import {Hoverable} from '../inputs/hoverable';
import {MostrarAngulo} from '../outputs/mostrarAngulo';
import { ColorirIsoceles } from '../outputs/colorirIsoceles';
import { MostrarTipo } from '../outputs/mostrarTipo';
import  MoverVertice  from '../outputs/moverVertice';
import { MostrarBissetriz } from '../outputs/mostrarBissetriz';
import { Clickable, MultipleClickable } from '../inputs/clickable';
import {CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer';

import * as dat from 'dat.gui';
import * as THREE from 'three';
import { TextoAparecendo } from '../animacoes/textoAparecendo';
import Animacao, { AnimacaoSequencial, AnimacaoSimultanea } from '../animacoes/animation';
import { colorirAngulo } from '../animacoes/colorirAngulo';
import { Tracejado } from '../objetos/tracejado';
import MostrarTracejado from '../animacoes/mostrarTracejado';
import { Divisao } from '../animacoes/divisao';
import { Triangle } from '../objetos/triangle';
import { Fase } from './fase';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader'
import Building from '../../assets/building.obj'
import BuildingMaterials from '../../assets/building.obj.mtl'
import ceu from '../../assets/sky.webp'
import diff from '../../assets/difuso.jpg'
import displacement from '../../assets/displacement.png'
import alpha from '../../assets/grass_bermuda_01_alpha_4k.png'
import normal from '../../assets/normal.exr'
import roughness from '../../assets/roughness.jpg'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import teste from '../../assets/grid.jpg'


export class Fase7 extends Fase{

    constructor(){

        super();

        this.trigonometria = [];

        this.addToScene(this.scene);

        this.levelDesign();
    }

    levelDesign(){

        const luz = new THREE.AmbientLight(0xffffff,0.3);
        const luz2 = new THREE.DirectionalLight(0xffffff, 3, 1);

        const target = new THREE.Object3D();

        target.position.copy(new THREE.Vector3(0,0,0));

        luz2.position.copy(new THREE.Vector3(0,40,40))

        luz2.distance = 0;

        luz2.castShadow = true;

        // luz.target = target;

        this.scene.add(target)
        this.scene.add(luz2)

        this.scene.add(luz)

        const scene = this.scene;

        //Propriedade tr tem que ser invertida, se não a opacidade 1 significa material invisível
        const mtlLoader = new MTLLoader().setMaterialOptions( { invertTrProperty: true } );
        mtlLoader.load(BuildingMaterials, (materials) => {

            materials.preload();

            // Load the object file (.obj)
            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load(Building, (object) => {
                // Adjust the position, scale, or any other properties of the loaded object
                object.scale.set(0.001, 0.001, 0.001);

                // Add the loaded object to the scene
                this.scene.add(object);

                object.rotation.x = Math.PI*1.5
                object.rotation.z = Math.PI

                object.traverse( function(child) {
                    if (child instanceof THREE.Mesh) 
                      // enable casting shadows
                      child.castShadow = true;
                      
                });
                    


                console.log(object,materials)
            });
        });


        // Create a plane geometry
        const planeGeometry = new THREE.PlaneGeometry(50, 50); // Width and height parameters

        // Create a basic material for the plane
        const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide }); // Specify color and side

        // Create a mesh using the geometry and material
        const planeMesh = new THREE.Mesh(planeGeometry, this.createGroundMaterial());

        planeMesh.receiveShadow = true;

        // Rotate the plane to make it horizontal
        planeMesh.rotation.x = Math.PI / 2;

        console.log(planeMesh)

        // Add the plane to the scene
        scene.add(planeMesh);

    }

    createGroundMaterial(){

        // const grid = new THREE.TextureLoader().load(teste)
        const diffuseMap = new THREE.TextureLoader().load(diff);
        const normalMap = new THREE.TextureLoader().load(normal);
        const alphaMap = new THREE.TextureLoader().load(alpha);
        const roughnessMap = new THREE.TextureLoader().load(roughness);
        const displacementMap = new THREE.TextureLoader().load(displacement);

        const setupTextura = (textura) =>{

            textura.wrapS = 100
            textura.wrapT = 100
            textura.repeat.set(100, 100);
        }

   
        setupTextura(diffuseMap)
        setupTextura(normalMap)
        setupTextura(alphaMap)
        setupTextura(roughnessMap)
        setupTextura(displacementMap)



        const material = new THREE.MeshStandardMaterial({
            map: diffuseMap,
            // normalMap: normalMap,
            roughnessMap: roughnessMap,
            displacementMap: displacementMap,
            displacementScale: 0.01,
            alphaMap: alphaMap, // Include alpha mask
            // color:0xffffff,
            side: THREE.DoubleSide 
        });

        return material;
    }

    setupThreejs({scene, width, height, renderer, camera, labelRenderer}) {

        scene.background = new THREE.TextureLoader().load(ceu);

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

        this.scene = scene;
        this.width = width;
        this.height = height;
        this.renderer = renderer;
        this.labelRenderer = labelRenderer;
        this.camera = camera;
        this.camera.position.z = 5;
        this.camera.position.y = 1.5;

        renderer.shadowMap.enabled = true

        const controls = new OrbitControls( camera, document.body );

        this.controls = controls;

        window.addEventListener('resize', function() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            labelRenderer.setSize(window.innerWidth, window.innerHeight);
        });

    }


    update(){
        // this.atualizarOptions();

        this.frames.map(frame => frame.next()); //Roda as animações do programa
        this.frames.map(frame => frame.next()); //Roda as animações do programa

        this.controls.update()

        console.log(this.controls)
 

        // if(options.atualizar) triangle.update();

        // if (this.triangulo.equilatero()) {
        //     this.changeText("VITORIA!!!");
        //     // botar notif
        // }
    }
}