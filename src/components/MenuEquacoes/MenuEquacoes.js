import React, { useEffect, useRef } from 'react';

import './style.css'; // Importe o arquivo de estilo

function MenuEquacoes(props) {

  const equationWindowRef = useRef(null);

  return (
    <div id="equationWindow" ref={equationWindowRef}></div>
  );
}

export default MenuEquacoes;
