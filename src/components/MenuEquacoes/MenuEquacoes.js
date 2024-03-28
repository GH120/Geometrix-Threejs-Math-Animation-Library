import React, { useEffect, useRef } from 'react';

import './style.css'; // Importe o arquivo de estilo
import { Whiteboard } from '../../js/cards/whiteboard';


//Quando quiser passar uma referência para um model
//É só criar um estado de referencia e passar ele tanto para o model quanto a div a ser usada
function MenuEquacoes(props) {

  const equationWindowRef = useRef(null);

    useEffect(() => {
        const whiteboard = new Whiteboard(equationWindowRef.current);

        const fase = props.fase;

        if(fase){
            fase.whiteboard = whiteboard;
            console.log("funcionou", fase.whiteboard)

            fase.appendOperadoresAJanelaEquacao(equationWindowRef.current);
        }
        
        // You can perform any further initialization or actions with the whiteboard instance here
        return () => {
            // Cleanup logic, if necessary
        };
    }, []);

    return (
        <div ref={equationWindowRef} className="whiteboard-container"></div>
    );
}

export default MenuEquacoes;
