import React from "react";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import HomePage from "./pages/Homepage";
import {BrowserRouter, Route, Routes} from 'react-router-dom'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
