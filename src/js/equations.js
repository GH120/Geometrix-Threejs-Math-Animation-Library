//Valores mapeando para objetos mesh
//Equações veem se alguma de suas variáveis aceitam esses valores
//Valores podem ser definidos, ou em função de outra variável
//Variáveis são subdivididas em instanciadas e dadas
//As instanciadas aceitam valores, mas tem seus requerimentos para funcionarem
//Por exemplo, o pitágoras requer que as duas primeiras sejam catetos e o triângulo seja retângulo
//As dadas são criadas pelo usuário ou impostas pelo problema, essas podem ser obtidas resolvendo as equações
//Um exemplo prático: considere um triângulo retângulo com lados x, x-1 e x-2. 
//Esses são três valores em função de uma variável
//Conseguimos instânciar a equação de pitágoras, resultando em uma nova equação
//(x-1)² + (x-2)² = x²
//Resolvendo essa equação chegamos em:
// x² -6x + 5 = 0
//Onde podemos instânciar baskhara para solucionar:
// x = 3 +- 2 => x = { 1 ; 5}
//Como todos os lados são positivos, então x = 5;

document.addEventListener("DOMContentLoaded", function() {
    const openButton = document.getElementById("openEquationWindow");
    const closeButton = document.getElementById("closeButton");
    const equationWindow = document.getElementById("equationWindow");

    openButton.addEventListener("click", function() {
        equationWindow.classList.remove("hidden");
    });

    closeButton.addEventListener("click", function() {
        equationWindow.classList.add("hidden");
    });
});