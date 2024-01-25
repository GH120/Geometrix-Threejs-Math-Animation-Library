import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import grid from '../../assets/grid.avif';
import './style.css';

export const MenuPrincipal = () => {
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

      const cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 16);
      const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
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

      // Adicionando os cilindros ao estado para que possam ser acessados no loop de animação
      cylinder.rotationAxis = direction.clone().normalize();
      cylinder.rotationSpeed = Math.random() * 0.05 + 0.01; // Ajuste a velocidade de rotação conforme necessário
    };

    // Adicionando cilindros para cada aresta
    addCylinder(0, 9);
    addCylinder(3, 6);
    addCylinder(6, 0);
    addCylinder(0, 3);
    addCylinder(3, 9);
    addCylinder(9, 6);

    // Posicionando a câmera
    camera.position.z = 5;

    // Função de animação
    const animate = () => {
      requestAnimationFrame(animate);

      // Girar a pirâmide
      pyramid.rotation.x += 0.01;
      pyramid.rotation.y += 0.01;

      scene.children.filter(obj => obj instanceof THREE.Mesh).forEach(mesh => {
        if (mesh.rotationAxis && mesh.rotationSpeed) {
          // Usar rotateOnAxis para girar o mesh
          mesh.rotateOnAxis(mesh.rotationAxis, mesh.rotationSpeed);
        }
      });

      // Renderizar a cena
      renderer.render(scene, camera);
    };

    // Iniciar a animação
    animate();

    // Atualizar o tamanho do canvas quando a janela for redimensionada
    window.addEventListener('resize', () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
    });

  }, []);

  return (
    <div className="menu">
      <div className="options">
        <h2>Menu Principal</h2>
        <ul>
          <li><Link to="/">Iniciar Jogo</Link></li>
          <li><a href="#">Escolher Fase</a></li>
          <li><a href="#">Créditos</a></li>
        </ul>
      </div>
      <div className="canvas-container">
        <canvas id="gameCanvas" width="800" height="600"></canvas>
      </div>
    </div>
  );
};
