import * as THREE from 'three';
import {Angle} from './angle';
import {Edge} from './edge.js';
import { Objeto } from './objeto';
import { Variable } from '../equations/expressions';


export class Poligono extends Objeto{

    constructor(positions =  [[0,0,0],[3,0,0],[3,3,0],]){

        super();

        this.grossura = 0.05
        this.raioVertice = 0.1
        this.raioAngulo  = 0.7
        this.sphereMaterial =   new THREE.MeshBasicMaterial({ color: 0x8c8c8c });
        this.cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xe525252 });
        this.numeroVertices = positions.length;

        //Placeholder
        this.mesh = {};


        this.positions = positions;
        this.edges = [];
        this.angles = [];
    }

    configuration(options){

        this.grossura    = options.grossura;
        this.raioVertice = options.raioVertice;
        this.raioAngulo  = options.raioAngulo;

        return this;
    }

    // setupProporcoes(grossuraVertice, grossuraAresta, raioAngulo){

    //     this.sphereGeometry = new THREE.SphereGeometry(grossuraVertice);

    //     this.grossura = grossuraAresta;

    //     this.raioAngulo = raioAngulo;

    //     this._renderVertices();
    // }

    render(){

        this.rendered = true;

        this.renderVertices();
        this.renderEdges();
        this.renderAngles();
        return this;
    }

    renderVertices(){

        this.sphereGeometry =   new THREE.SphereGeometry(this.raioVertice);

        const esferas = this.positions.map(position => {
            const esfera = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
            esfera.position.set(...position);
            return esfera;
        });

        //Gambiarra enquanto não transforma o vértice em um objeto
        this.vertices = esferas.map(vertice => Objeto.fromMesh(vertice))

        this.vertices.forEach((vertice, index) => vertice.index = index);


        // console.log(this.vertices)

        return this;
    }

    renderEdges(){

        const proximo = (index) => this.vertices[(index+1) % this.numeroVertices];

        const getPosition = (objeto) => objeto.mesh.position;

        this.edges = this.vertices.map(
                        (vertice, index) => new Edge(getPosition(vertice), getPosition(proximo(index), this.grossura))
                    );

        this.edges.map(edge => edge.grossura = this.grossura);

        return this;
    }

    renderAngles(){

        const vertices = this.vertices;
        
        this.angles = vertices.map( (vertex, index) => {
            
            const angle = new Angle(vertices, index).render();

            angle.angleRadius = this.raioAngulo;

            return angle;
        });

        return this;
    }

    // _renderVertices(){

    //     let index = 0;
        
    //     for(const vertice of this.vertices){

    //         const esfera = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);

    //         esfera.position.copy(this.positions[index++]);

    //         if(vertice.scene) vertice.removeFromScene();

    //         vertice.mesh = esfera;
    //     }
    // }

    addToScene(scene){

        this.scene = scene; 

        //Tratar caso onde não foi renderizado
        if(!this.rendered) this.render();

        this.mesh.parent = scene;

        this.vertices.map(vertex => vertex.addToScene(scene))
        this.edges.map(   edge   => edge.addToScene(scene));
        this.angles.map(  angle  => angle.addToScene(scene));

        this.update();

        return this;
    }

    removeFromScene(){

        const scene = this.scene;

        this.vertices.map(vertex => scene.remove(vertex.mesh));
        this.edges.map(   edge   => scene.remove(edge.mesh));
        this.angles.map(  angle  => scene.remove(angle.mesh));

        return this;
    }

    //**Cria variáveis para os vértices */
    nomearVertices(...nomes){

        this.vertices.forEach((vertice, indice) => {

            vertice.variable = new Variable(nomes[indice]);
        })

        this.edges.forEach((aresta, indice) => {

            const proximo = (indice + 1) % nomes.length;

            aresta.variable = new Variable(nomes[indice].concat(nomes[proximo]));
        })

        return this;
    }

    update(){

        const proximo = (index) => this.vertices[(index+1) % this.numeroVertices];

        const scene = this.scene;

        //Atualiza as malhas das arestas
        // this.edges.map(edge => (edge.scene)? edge.removeFromScene() : null);
        // this.renderEdges();
        // this.edges.map(edge => edge.addToScene(scene));

        this.vertices.forEach((vertice, index) => {
            this.edges[index].origem  = vertice.getPosition();
            this.edges[index].destino = proximo(index).getPosition();
        });

        this.edges.map(edge => edge.update());

        //Atualiza a malha dos ângulos
        this.angles.map(angle => angle.update())
    }

    escala(x,y,z){

        //Novas posições
        this.positions = this.positions.map(posicao => [posicao[0]*x, posicao[1]*y, posicao[2]*z])

        console.log(this.angles, "o this")
        // //Consertar depois
        // //Para saber o tamanho dos ângulos
        // this.angles.map(angle => angle.angleRadius = Math.sqrt(x*x +y*y+z*z) *0.25)
        // this.angles.map(angle => angle.render());
        // this.angles.map(angle => angle.render());


        //Reseta a malha
        if(this.scene) this.removeFromScene();

        this.render();

        if(this.scene) this.addToScene(this.scene);

        return this;
    }

    translacao(x,y,z){

        //Novas posições
        this.positions = this.positions.map(posicao => [posicao[0]+x, posicao[1]+y, posicao[2]+z])

        console.log(this.angles, "o this")
        // //Consertar depois
        // //Para saber o tamanho dos ângulos
        // this.angles.map(angle => angle.angleRadius = Math.sqrt(x*x +y*y+z*z) *0.25)
        // this.angles.map(angle => angle.render());
        // this.angles.map(angle => angle.render());


        //Reseta a malha
        if(this.scene) this.removeFromScene();

        this.render();

        if(this.scene) this.addToScene(this.scene);

        return this;
    }

    retangulo(){

        const arredondar = valor => parseFloat(valor.toFixed());

        const igual = (alpha,beta) => Math.abs(arredondar(alpha) - arredondar(beta)) == 0;
        
        return this.angles.map(angulo => igual(angulo.degrees, 90))
                          .reduce((ehNoventaGraus, existe) => existe || ehNoventaGraus, false);
    }

    isoceles(){

        const arredondar = valor => parseFloat(valor.toFixed());

        const igual = (alpha,beta) => Math.abs(arredondar(alpha.degrees) - arredondar(beta.degrees)) == 0;

        for(const angulo1 of this.angles)
            for(const angulo2 of this.angles)
                if(angulo1 != angulo2 && igual(angulo1,angulo2))
                    return true;
        
        return false;
    }

    equilatero(){

        const arredondar = valor => parseFloat(valor.toFixed());

        const igual = (alpha,beta) => Math.abs(arredondar(alpha.degrees) - arredondar(beta.degrees)) == 0;

        for(const angulo1 of this.angles)
            for(const angulo2 of this.angles)
                if(!igual(angulo1,angulo2))
                    return false;
        
        return true;
    }

    renderedInScene(){

        const renderizouVertices = this.vertices && this.vertices[0];

        const verticesNaCena     = this.vertices.filter(vertice => vertice.mesh.parent).length == this.numeroVertices

        return renderizouVertices && verticesNaCena;
    }

    isTriangulo(){
        return true;
    }

    get centro(){

        if(!this.vertices) 
            return  this.positions.map(position => new THREE.Vector3().fromArray(position))
                        .reduce((a,b) => a.add(b), new THREE.Vector3(0,0,0))
                        .multiplyScalar(1/3)

        console.log(this.vertices)

        return this.vertices.map(vertice => vertice.getPosition())
                            .reduce((a,b) => a.add(b), new THREE.Vector3(0,0,0))
                            .multiplyScalar(1/this.numeroVertices);
    }

    get raio(){
        return this.vertices[0].position.clone().sub(this.centro).length();
    }

    get hitbox(){

        if(this._hitbox) return this._hitbox;


        // 2. Define the points of the polygon
        const points = this.positions.map(positions => new THREE.Vector2(positions[0], positions[1]))

        // 3. Create the shape using the points
        const shape = new THREE.Shape(points);

        // 4. Create the geometry from the shape
        const geometry = new THREE.ShapeGeometry(shape);

        // 5. Create a mesh with a basic material
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
        const polygonMesh = new THREE.Mesh(geometry, material);


        this._hitbox = polygonMesh;

        return this._hitbox;
    }

    /**Retorna se é horário ou antihorário */
    calcularSentido() {

        const vertices = this.vertices.map(vertice => vertice.getPosition());

        let soma = 0;
        for (let i = 0; i < vertices.length; i++) {
            const current = vertices[i];
            const next = vertices[(i + 1) % vertices.length];
            soma += (next.x - current.x) * (next.y + current.y);
        }

        return soma > 0 ? 1 : -1;
    }
}