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

    const variaveis = {'a': ['a', handleLetterClick],
                       'b': ['b', handleLetterClick],
                       'c': ['c', handleLetterClick]}

    updateEquationContent("a² + b² = c²", variaveis)
});


function updateEquationContent(texto, letters) {

  const equationContent = document.createElement("div");
  equationContent.id = "equationContent";

  const equationWindow = document.getElementById("equationWindow");

  equationWindow.insertBefore(equationContent, equationWindow.firstChild);

  texto.split(/([abc])/)
       .map(element => {
            if(letters[element]) return addButtonToEquation(...letters[element])

            const span = document.createElement("span");

            span.textContent = element;

            return span;
        })
       .map(element => equationContent.append(element))

}

function addButtonToEquation(letter, clickFunction) {
  const button = document.createElement("button");
  button.className = "equation-letter";
  button.textContent = letter;
  button.addEventListener("click", function() {
      clickFunction(letter);
  });

  return button
}

function handleLetterClick(letter) {
  alert(`Letter ${letter} clicked!`);
}
