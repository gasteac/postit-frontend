import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
export const AdminRoute = () => {
  //Verificamos si el usuario esta logueado o no
  const { currentUser } = useSelector((state) => state.user);
  //Si el usuario ESTA logueado y ES ADMIN, mostramos el contenido de la ruta
  //Outlet es un componente de react-router-dom que se usa para renderizar algo ahi
  //Una especie de children, en este caso, las rutas que estan dentro de PrivateRoute en App.jsx
  // Si el usuario NO esta logueado y encima NO es acmon, lo redirigimos a la home

  // se pone tmb currentUser.isAdmin? porque sino si currentUser es null, no va a poder acceder a isAdmin y tira error
  return currentUser && currentUser.isAdmin ? (<Outlet />) : (<Navigate to="/dashboard?tab=profile" />);
};
