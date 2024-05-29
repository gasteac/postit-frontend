import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
export const PublicRoute = () => {
  //Verificamos si el usuario esta logueado o no
  const { currentUser } = useSelector((state) => state.user);
  //Si el usuario NO ESTA logueado, mostramos el contenido de la ruta
  //Outlet es un componente de react-router-dom que se usa para renderizar algo ahi
  //Una especie de children, en este caso, las rutas que estan dentro de PublicRoute en App.jsx
  return !currentUser ? <Outlet /> : <Navigate to="/" />;
};
