import * as THREE from 'three';

export class Draggable {

  constructor(object,camera) {
    this.camera = camera;
    this.object = object;
    this.dragging = false;

    this.raycaster = new THREE.Raycaster();

    this.plane = new THREE.Mesh(
      new THREE.PlaneGeometry(100,100),
      new THREE.MeshBasicMaterial({color:0xffffff})
    );

    this.plane.position.z = -5;

    // Add event listeners for mouse down, move, and up events
    window.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    window.addEventListener('mouseup', this.onMouseUp.bind(this), false);

  }

  onMouseDown() {
    // Calculate the mouse position in normalized device coordinates (-1 to +1)
    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    

    // Raycast to determine the intersection point between the mouse and the object's plane
    this.raycaster.setFromCamera(mouse, this.camera);
    
    const intersects = this.raycaster.intersectObject(this.object);

    if (intersects.length > 0) {
      this.dragging = true;
    }
  }

  onMouseMove(event) {
    // Check if the object is being dragged
    if (this.dragging) {
      // Calculate the mouse position in normalized device coordinates (-1 to +1)
      const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );
      

      // Raycast to determine the intersection point between the mouse and the object's plane
      this.raycaster.setFromCamera(mouse, this.camera);
      
      const intersects = this.raycaster.intersectObject(this.plane);

      if (intersects.length > 0) {
        // Update the object's position to the intersection point
        this.object.position.copy(intersects[0].point);
      }
    }
  }

  onMouseUp() {
    this.dragging = false;
  }
}
