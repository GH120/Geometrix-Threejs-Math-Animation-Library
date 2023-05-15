function criarBotoesCirculares(div) {
    // Cria a lista de botões
    const lista = document.createElement('ul');
    lista.className = "listafases";
    
    // Cria os botões
    for (let i = 1; i <= 10; i++) {
        const botao = document.createElement('button');
        botao.className = "botaofase";
        botao.innerHTML = i;
        
        lista.appendChild(botao);
    }
    
    // Insere a lista na div
    div.appendChild(lista);
    
    // Adapta a posição dos botões
    const larguraDiv = div.clientWidth;
    const larguraBotoes = 10 * 40; // Largura dos 10 botões (30 + 5*2 de margem)
    if (larguraDiv < larguraBotoes) {
        lista.style.textAlign = 'center';
    } else {
        lista.style.display = 'flex';
        lista.style.justifyContent = 'center';
        lista.style.alignItems = 'center';
    }
}

const divs = document.getElementsByClassName('divfase');

for (let i = 0; i < 3; ++i) {
    criarBotoesCirculares(divs[i])
}