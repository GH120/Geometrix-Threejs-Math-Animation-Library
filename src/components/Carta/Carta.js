import React, { useEffect, useRef } from 'react';
import './style.css'

function Carta(props) {
    const { valor, naipe } = props;
    const componenteRef = useRef(null);

    useEffect(() => {
        console.log('current: ', componenteRef.current)
    }, [])

    const handleDragStart = (e) => {
        e.dataTransfer.setData('text/plain', ''); // Define um dado de arraste, que é necessário para ativar o arraste.
    };
    
    const handleDragEnd = (e) => {
        console.log(componenteRef.current)

    };


    return (
        <div
            className="carta"
            draggable={true}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className={`valor ${naipe}`}>{valor}</div>
            <div className={`naipe ${naipe}`}>
                {naipe === 'copas' || naipe === 'ouros' ? '♦' : '♠'}
            </div>
        </div>
    );
}

export default Carta;
