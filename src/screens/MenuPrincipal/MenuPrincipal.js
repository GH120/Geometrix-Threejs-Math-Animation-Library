import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import grid from '../../assets/grid.avif';
import './style.css';
import BotaoFase from '../../components/BotaoFase/BotaoFase';
import Modal from '../../components/modal/Modal';
import MenuFaseNovo from '../../components/MenuFaseNovo/MenuFaseNovo';
import { IoClose } from "react-icons/io5";

export const MenuPrincipal = () => {

  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpen2, setModalOpen2] = useState(false);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });

    scene.background = new THREE.TextureLoader().load(grid);

    // Adicionando uma pirâmide de 4 faces
    const pyramidGeometry = new THREE.TetrahedronGeometry(2);
    const material = new THREE.MeshBasicMaterial({ color: 0xe525252, wireframe: true });
    const pyramid = new THREE.Mesh(pyramidGeometry, material);
    scene.add(pyramid);

    // Acessando o array de posições
    const positions = pyramidGeometry.attributes.position.array;

    console.log(pyramidGeometry)

    // Calculando o ponto médio da pirâmide
    const pyramidCenter = new THREE.Vector3();
    for (let i = 0; i < positions.length; i += 3) {
      pyramidCenter.x += positions[i];
      pyramidCenter.y += positions[i + 1];
      pyramidCenter.z += positions[i + 2];
    }
    pyramidCenter.divideScalar(positions.length / 3);

    // Adicionando cilindros conectando cada vértice ao vértice oposto no plano inferior
    const addCylinder = (startIdx, endIdx) => {
      const start = new THREE.Vector3(positions[startIdx], positions[startIdx + 1], positions[startIdx + 2]);
      const end = new THREE.Vector3(positions[endIdx], positions[endIdx + 1], positions[endIdx + 2]);

      const cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 16);
      const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xdddddd });
      const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

      // Subtraindo o ponto médio da pirâmide das posições
      start.sub(pyramidCenter);
      end.sub(pyramidCenter);

      // Posicionando o cilindro entre os vértices
      const midpoint = new THREE.Vector3().addVectors(start, end).divideScalar(2);
      cylinder.position.copy(midpoint);

      // Orientando o cilindro na direção da aresta
      const direction = new THREE.Vector3().subVectors(end, start);
      cylinder.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());

      // Adicionando de volta o ponto médio da pirâmide para manter a posição correta
      cylinder.position.add(pyramidCenter);

      scene.add(cylinder);

      return cylinder
    };

    const addSphere = (startIdx) => {
      const start = new THREE.Vector3(positions[startIdx], positions[startIdx + 1], positions[startIdx + 2]);

      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.2),
        new THREE.MeshBasicMaterial({ color: 0xdd0000 })
      );

      sphere.position.copy(start);

      scene.add(sphere);

      return sphere;
    }

    
    const cilindros = [];
    
    // Adicionando cilindros para cada aresta
    cilindros.push([addCylinder(0, 9), [0, 9]]);
    cilindros.push([addCylinder(3, 6), [3, 6]]);
    cilindros.push([addCylinder(6, 0), [6, 0]]);
    cilindros.push([addCylinder(0, 3), [0, 3]]);
    cilindros.push([addCylinder(3, 9), [3, 9]]);
    cilindros.push([addCylinder(9, 6), [9, 6]]);

    const spheres = [];

    cilindros.push([addSphere(0), [0]]);
    cilindros.push([addSphere(3), [3]]);
    cilindros.push([addSphere(6), [6]]);
    cilindros.push([addSphere(9), [9]]);
    
    const grupo = new THREE.Group();
    grupo.add(pyramid);
    cilindros.forEach((cil) => {
      grupo.add(cil[0]);
    })
    spheres.forEach((sph) => {
      grupo.add(sph[0]);
    })
    scene.add(grupo);

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);

      // Girar o grupo
      grupo.rotation.x += 0.01;
      grupo.rotation.y += 0.01;
      
      renderer.render(scene, camera);
    };

    animate();

    // Atualizar o tamanho do canvas quando a janela for redimensionada
    window.addEventListener('resize', () => {

      const canvasDiv = document.getElementById('gameCanvasDiv');
    
      const newWidth = canvasDiv.offsetWidth;
      const newHeight = canvasDiv.offsetHeight;

      console.log('width e height: ', newWidth, newHeight);

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
    });

  }, []);


  return (
    <div className="menu">
      <title>GEOMETRIX</title>
      <div className="options">
        <h1>Geometrix</h1>
        <ul>
          <li className="elemento-lista-menu"><Link to="/level/1">INICIAR </Link></li>
          <li className="elemento-lista-menu" onClick={() => {setModalOpen(true)}}><a href="#">ESCOLHER FASE</a></li>
          <li className="elemento-lista-menu" onClick={() => {setModalOpen2(true)}}><a href="#">CRÉDITOS</a></li>
        </ul>
      </div>
      <div id='gameCanvasDiv' className="canvas-container">
        <canvas id="gameCanvas" width="1600" height="900"></canvas>
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}><MenuFaseNovo onClose={() => setModalOpen(false)} /></Modal>
      <Modal isOpen={modalOpen2} onClose={() => setModalOpen2(false)}>
        <div>
          <button onClick={() => setModalOpen2(false)} className='botao-invisivel'>
              <IoClose color='#5A689B' size={50}/>
          </button>
          <div className='h2-menu-fase-wrapper-second'>
              <h1 className='h2-menu-fase efeitos tira-margem'>Créditos</h1>
              <h3 className='h2-menu-fase efeitos tira-margem'>Programador Líder</h3>
              <h4 className='tira-margem'>Felipe Vieira Duarte</h4>
              <h3 className='h2-menu-fase efeitos tira-margem'>Com ajuda de:</h3>
              <h4 className='tira-margem'>Havillon Freitas<br/>Renan Xerez<br/>Thomaz Ângelo<br/>Vitor Manoel</h4>
              <h3 className='h2-menu-fase efeitos tira-margem'>Repositório</h3>
              <a className='tira-margem font-menor' href='https://github.com/GH120/Geometrix-Threejs-Math-Animation-Library'>
                github.com/GH120/Geometrix-Threejs-Math-Animation-Library
              </a>
          </div>
        </div>
      </Modal>
    </div>
  );
};
