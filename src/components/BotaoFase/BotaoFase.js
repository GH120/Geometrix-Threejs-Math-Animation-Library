import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom';

import './style.css'

import { FiLock } from "react-icons/fi";

function BotaoFase({faseSelec = 1, faseLib = true}) {

    const [liberada, setLiberada] = useState(faseLib);
    const [fase, setFase] = useState(faseSelec);

    const navigator = useNavigate();

    return (
        <button 
            onClick={() => {
                if (liberada)
                    navigator(`level/${faseSelec}`);
            }} 
            className={liberada ? 'botao-fase' : 'botao-fase-cadeado'}
        >
            {liberada ? fase : <div className='encapsula-icone'><FiLock color="gray" fontSize="0.7em"/></div>}
        </button>
    )
}

export default BotaoFase