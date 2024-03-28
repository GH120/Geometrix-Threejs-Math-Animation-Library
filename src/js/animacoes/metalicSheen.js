import Animacao from "./animation";

import * as THREE from 'three';

export default class MetalicSheen extends Animacao{

    constructor(objeto){

        super();

        this.createMaterial();

        const materialAntigo = objeto.material;


        this.setOnStart(() => {
            
            objeto.material      = this.material;
            objeto.mesh.material = this.material;
            objeto.mesh.geometry.computeVertexNormals();
            
            console.log(objeto.mesh, "detalhe")
        })

        this.frames = 150;
        this.setValorInicial(0);
        this.setValorFinal(2);
        this.setInterpolacao((a,b,c) => a*(1-c) + b*c); //Interpolação normal
        this.setUpdateFunction((time) => {

            this.material.uniforms.time.value = time;
        })
        
        this.setOnTermino(() => objeto.material = materialAntigo);

        this.setCurva(x =>{
            return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
        })
    }

    createMaterial(){
// Vertex shader
const vertexShader = `
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader
//\operatorname{ceil}\left(\max\left(\sin x,0\right)\right)\cdot\frac{\operatorname{abs}\left(x\right)}{\pi}
//\operatorname{ceil}\left(\max\left(\sin\left(x-\pi\right),0\right)\right)\cdot\left(\operatorname{ceil}\left(\frac{\operatorname{abs}\left(x\right)}{\pi}-1\right)\right)
const fragmentShader = `
#define PI 3.1415926535897932384626433832795

precision highp float;

uniform vec2 u_resolution;
uniform float time;

float stretchSine(float angle){

    float partial = float(mod(angle/PI, 11.0));

    bool positiveSine = partial > 10.00;

    if(positiveSine) return float(mod(angle, PI));

    float cycles  = floor(angle/(11.0*PI));
    
    return PI*(1.0+ partial/10.0);
}

void main() {

    // Define the direction of the line (adjust as needed)
    vec2 direction = normalize(vec2(1.0, 1.0));

    // Calculate the position of the fragment along the line
    vec2 position = gl_FragCoord.xy;

    float angle = dot(direction, position)*0.1 + 40.0*time;

    float poscolor = sin(stretchSine(angle));

    // Apply a threshold to create a white line
    float line = poscolor;

    vec3 color = vec3(1.0, 0.0, 0.0) + vec3(0.0,line,line);

    // Output the final color
    gl_FragColor = vec4(1.0,line,line, 1.0);
}
`;
        // Create shader material
        const shaderMaterial = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
          fragmentShader: fragmentShader,
          uniforms: {
              time: {value:0},
              u_resolution: {value:1}
          }
        })

        shaderMaterial.needsUpdate = true;
        

        // Assign the shader material to your mesh
        this.material = shaderMaterial;

    }
}