import * as THREE from 'three';

export class Clickable {

  constructor(object,camera) {
    this.camera = camera;
    this.object = object;
    this.dragging = false;
    this.observers = [];

    this.raycaster = new THREE.Raycaster();

    // Add event listeners for mouse down, move, and up events
    window.addEventListener('click', this.onClick.bind(this), false);
  }

  onClick(event) {

    const point = this.intersectouObjeto(event, this.plane);

    const selecionado = !!point;

    //Notifica todos os observadores da nova posição
    this.notify({clicado: selecionado});
    
  }
  

  
  intersectouObjeto(event){

    // Calculate the mouse position in normalized device coordinates (-1 to +1)
    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    

    // Raycast to determine the intersection point between the mouse and the object's plane
    this.raycaster.setFromCamera(mouse, this.camera);

    const hitbox = this.object.hitbox;
    
    const intersects = this.raycaster.intersectObject(hitbox);

    if (intersects.length > 0) {
      // Update the object's position to the intersection point
      return intersects[0].point;
    }

    return null;
  }

  notify(estado){
    for(const observer of this.observers) if(observer) observer.update(estado);
  }

  addObserver(observer){
    this.observers.push(observer);
    return this;
  }

  removeObserver(criteria){
    this.observers = this.observers.filter(criteria);
    return this;
  }
}

export class MultipleClickable{

    constructor(objects,camera) {
        this.camera = camera;
        this.objects = objects;
        this.dragging = false;
        this.observers = [];
    
        this.raycaster = new THREE.Raycaster();
    
        // Add event listeners for mouse down, move, and up events
        window.addEventListener('click', this.onClick.bind(this), false);
      }
    
      onClick(event) {
    
        const selecionados = this.objects.map(object => this.intersectouObjeto(event, object));

        //Notifica todos os observadores da nova posição
        this.notify({clicados: selecionados});
        
      }
      
    
      
      intersectouObjeto(event, object){
    
        // Calculate the mouse position in normalized device coordinates (-1 to +1)
        const mouse = new THREE.Vector2(
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1
        );
        
    
        // Raycast to determine the intersection point between the mouse and the object's plane
        this.raycaster.setFromCamera(mouse, this.camera);
    
        const hitbox = object.hitbox;

        const intersects = this.raycaster.intersectObject(hitbox);
    
        if (intersects.length > 0) {
          // Update the object's position to the intersection point
          return intersects[0];
        }
    
        return null;
      }
    
      notify(estado){
        for(const observer of this.observers) if(observer) observer.update(estado);
      }
    
      addObserver(observer){
        this.observers.push(observer);
        return this;
      }
    
      removeObserver(criteria){
        this.observers = this.observers.filter(criteria);
        return this;
      }
}
