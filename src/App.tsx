import * as THREE from 'three'
import { useEffect, useRef, useState } from "react";

import { createBrowserRouter, RouterProvider, BrowserRouter as Router, Route, Link } from 'react-router-dom';

import FirstScreen from './FirstScreen'
import { MenuPrincipal } from './screens/MenuPrincipal/MenuPrincipal';
import ErrorPage from './screens/ErrorPage/ErrorPage';
import LevelScreen from './screens/LevelScreen/LevelScreen';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MenuPrincipal />,
    errorElement: <ErrorPage />,
  },
  {
    path: "teste",
    element: <MenuPrincipal />
  },
  {
    path: "/level/:id",
    element: <LevelScreen />
  }
]);

function MyThree() {
  
  return (
    <RouterProvider router={router} />
  );  
}

export default MyThree;
