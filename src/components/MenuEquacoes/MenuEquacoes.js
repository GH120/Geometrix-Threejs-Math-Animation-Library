import React, { useEffect, useRef, useState } from 'react';

import './style.css'; // Importe o arquivo de estilo
import { Whiteboard } from '../../js/cards/whiteboard';


//Quando quiser passar uma referência para um model
//É só criar um estado de referencia e passar ele tanto para o model quanto a div a ser usada
function MenuEquacoes(props) {

  const equationWindowRef = useRef(null);

  const [cursor, setCursor] = useState('default');

  const applyCursorStyle = (element, cursorStyle) => {
    if (element) {
      element.style.cursor = cursorStyle;
      const children = element.querySelectorAll('*');
      children.forEach(child => {
        child.style.cursor = cursorStyle;
        child.style.pointerEvents = (props.hidden)? 'none' : 'auto';
      });
    }
  };
    useEffect(() => {
        const whiteboard  = new Whiteboard(equationWindowRef.current);

        equationWindowRef.current && equationWindowRef.current.children[0].appendChild(whiteboard.labelRenderer.domElement)

        whiteboard.ativar = props.ativar;

        const fase = props.fase;

        if(fase){
            fase.whiteboard = whiteboard;

            fase.whiteboard.settings = {setCursor: (tipo) => {setCursor(tipo); fase.whiteboard.settings.tipo = tipo; console.log(fase.whiteboard.settings)}, tipo: cursor}; //Gambiarra para poder usar settings nos inputs, refatorar depois

            console.log("funcionou", fase.whiteboard)

            fase.appendOperadoresAJanelaEquacao(equationWindowRef.current);
        }
        
        // You can perform any further initialization or actions with the whiteboard instance here
        return () => {
            // Cleanup logic, if necessary
        };
    }, []);

    applyCursorStyle(equationWindowRef.current, cursor);

    return (
        <div ref={equationWindowRef} style={{cursor: cursor, pointerEvents: (props.hidden)? 'none' : 'auto'}} className="whiteboard-container"></div>
    );
}

export default MenuEquacoes;
