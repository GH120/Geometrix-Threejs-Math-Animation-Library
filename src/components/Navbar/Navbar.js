import React, { useState } from 'react';
import './style.css'; // Importe o arquivo de estilo

import { FiMenu } from 'react-icons/fi'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <button className="menu-button" onClick={toggleMenu}>
        <FiMenu />
      </button>
      <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        {/* colocar modal de fases aqui (eu acho) */}
      </div>
      <h1 className="navbar-title">GEOMETRIX</h1>
    </nav>
  );
}

export default Navbar;
