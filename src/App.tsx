import * as THREE from 'three'
import { useEffect, useRef, useState } from "react";

import { createBrowserRouter, RouterProvider, BrowserRouter as Router, Route, Link } from 'react-router-dom';

import FirstScreen from './FirstScreen'
import { TestScreen } from './TestScreen';

const router = createBrowserRouter([
  {
    path: "/",
    element: <FirstScreen />
  },
  {
    path: "teste",
    element: <TestScreen />
  }
]);

function MyThree() {
  
  return (
    <RouterProvider router={router} />
  );  
}

export default MyThree;
