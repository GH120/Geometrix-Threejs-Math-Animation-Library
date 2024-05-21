import * as THREE from 'three';
import { Input } from './Input';
import { Hoverable } from './hoverable';
import { Output } from '../outputs/Output';

export class Draggable extends Input{

  constructor(object,camera, container) {
    super(object,camera, container);

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(100,100),
      new THREE.MeshBasicMaterial({color:0xffffff})
    );

    this.plane = plane;

    this.dragging = false;

    this.outputMudarCursor(object, camera, container);


    // Add event listeners for mouse down, move, and up events
    window.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    window.addEventListener('mouseup', this.onMouseUp.bind(this), false);

  }

  onMouseDown(event) {

    const point = this.intersectouObjeto(event, this.object);
    
    if (!point) return;
    
    this.dragging = true;

    const aindaContinuaSegurando = () => (this.dragging)? this.simulateMouseMove(): clearInterval(this.checkInterval)

    // Start an interval to periodically check if mouse is still down
    this.checkInterval = setInterval(aindaContinuaSegurando, 100); // Check every 0.1 seconds

    this.mudarCursor.update({dragging:true})

  }

  onMouseMove(event) {

    if (this.dragging) {

      const colision = this.intersectouObjeto(event, {hitbox: this.plane});

      if(!colision) return;

      this.lastPosition = colision.point;

      //Notifica todos os observadores da nova posição, metodo do Input
      this.notify({position: colision.point, dragging:true});

    }

    this.lastClientX = event.clientX;
    this.lastClientY = event.clientY;

    
  }

  onMouseUp() {
    this.dragging = false;
    
    this.notify({position:this.lastPosition, dragging:false});
    
    this.mudarCursor.update({dragging:false})


  }

  simulateMouseMove() {
    // Simulate a mouse move event
    const event = new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      clientX: this.lastClientX,
      clientY: this.lastClientY
    });

    this.onMouseMove(event);
  }

  outputMudarCursor(object, camera, container){

    const draggable = this;

    //Output mudar cursor
    const hover = new Hoverable({}, camera, container);

    hover.object = object;

    this.mudarCursor = new Output([hover])
                      .setUpdateFunction(function(novoEstado){

                        const estado = this.estado;
                        

                        
                        if(novoEstado.dentro   != undefined) 
                            estado.dentro     = novoEstado.dentro;
                        if(novoEstado.dragging != undefined) 
                            estado.segurando  = novoEstado.dragging;

                        const setCursor = (cursor) => {
                          camera.fase.settings.setCursor(cursor);
                          estado.cursor = cursor;
                        }

                        const soltarObjeto = () => {

                          if(estado.cursor == 'grabbing'){
                            setCursor('grab');

                            setTimeout(() => {
                              if((!estado.dentro && !estado.segurando) || !draggable.observers.length)
                                setCursor('default')
                            }, 500);

                          }

                          else setCursor('default');
                        }
                        if(!camera.fase.settings) return;

                        if(!draggable.observers.length) {
                          if(estado.segurando || estado.dentro) soltarObjeto()
                        }

                        else if(estado.segurando) setCursor('grabbing')
                        else if(estado.dentro)    setCursor('grab')
                        else                      soltarObjeto()
                      
                      })
                      .setEstadoInicial({
                        segurando:false,
                        dentro:false,
                        cursor: 'default'
                      })
  }
}
