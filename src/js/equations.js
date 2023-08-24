class Pythagoras {

    constructor(){

        this.equation = "a² + b² = c²";

        this.variables = {
            'a': ['a', handleLetterClick],
            'b': ['b', handleLetterClick],
            'c': ['c', handleLetterClick]
        }

    }

    updateEquationContent() {

        const equationContent = document.createElement("div");
        equationContent.id = "equationContent";
      
        const equationWindow = document.getElementById("equationWindow");
      
        equationWindow.insertBefore(equationContent, equationWindow.firstChild);
      
        this.equation.split(/([abc])/)
                  .map(letters => {
      
                          if(this.variables[letters]) 
                              return this.addButtonToEquation(...this.variables[letters])
      
                          const span = document.createElement("span");
      
                          span.textContent = letters;
      
                          return span;
                      })
                  .map(element => equationContent.append(element))
      
      }
      
      addButtonToEquation(letter, clickFunction) {
        const button = document.createElement("button");
        button.className = "equation-letter";
        button.textContent = letter;
        button.addEventListener("click", function() {
            clickFunction(letter);
        });
      
        return button
      }
}

document.addEventListener("DOMContentLoaded", function() {
    const openButton = document.getElementById("openEquationWindow");
    const closeButton = document.getElementById("closeEquationWindow");
    const equationWindow = document.getElementById("equationWindow");

    openButton.addEventListener("click", function() {
        equationWindow.classList.remove("hidden");
    });

    closeButton.addEventListener("click", function() {
        equationWindow.classList.add("hidden");
    });

    new Pythagoras().updateEquationContent()
});

function handleLetterClick(letter) {
  alert(`Letter ${letter} clicked!`);
}
