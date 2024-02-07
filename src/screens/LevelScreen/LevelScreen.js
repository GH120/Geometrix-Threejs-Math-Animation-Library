import React from 'react'
import { useParams } from 'react-router-dom'

const LevelScreen = () => {

    const { id } = useParams();
  

  return (
    <div>
        <h1>Fase {id}</h1>
    </div>
  )
}

export default LevelScreen