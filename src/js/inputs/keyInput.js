import { Input } from "./Input";

export default class KeyInput extends Input{

    //Gambiarra pois o KeyInput não precisa obrigatoriamente de objeto
    constructor(object = {}, camera = null) {
        super(object, camera);

        // Add event listeners for key down and key up events
        window.addEventListener('keydown', this.onKeyDown.bind(this), false);
        window.addEventListener('keyup', this.onKeyUp.bind(this), false);
    }
    
    onKeyDown(event) {
        // Handle key down event
        const keyCode = event.keyCode;

        // Your logic for handling key down goes here

        // Example: Notify observers about the key down event
        this.notify({ keyDown: keyCode });
    }

    onKeyUp(event) {
        // Handle key up event
        const keyCode = event.keyCode;

        // Your logic for handling key up goes here

        // Example: Notify observers about the key up event
        this.notify({ keyUp: keyCode });
    }
}