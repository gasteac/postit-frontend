import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  AllPosts,
  CreatePost,
  Dashboard,
  Home,
  PostPage,
  SignIn,
  SignUp,
  UpdatePost,
  Search,
} from "./pages";
import { Header, PublicRoute, PrivateRoute } from "./components";
import { AdminRoute } from "./components/AdminRoute";
// ScrollToTop es un componente que se encarga de que cuando cambiamos de ruta, la página se muestre desde arriba
import { ScrollToTop } from "./components/ScrollToTop";
import { FooterComponent } from "./components/Footer";
import  {Navbar}  from "./components/Navbar";

export const App = () => {
  return (
    <>
      {/* toda la app esta dentro de browserRouter, tenemos primero el header, dsp
      las paginas, y dsp el footer */}
      <BrowserRouter>
        {/* Componente para que si nos movemos a otra ruta, la página se muestre desde arriba (osea sube el scroll arriba) */}
        <ScrollToTop />
        {/* aca va el header, que es el único componente que se va a ver siempre */}
        {/* <Header /> */}
       <Navbar/>
        <Routes className="overflow-clip">
          {/* si pongo una ruta mal me redirige a home con el *   */}
          <Route
            className="bg-black"
            path="*"
            element={<Navigate to="/" replace />}
          />
          {/* RUTAS PUBLICAS PARA EL USUARIO NO AUTENTICADO.  */}
          {/* Solo puedo acceder a estas rutas si NO ESTOY autenticado (PublicRoute) */}
          {/* Es un componente al que le paso los children, y si el usuario NO esta autenticado, los muestra, sino, redirige a la ruta de dashboard */}
          <Route element={<PublicRoute />}>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
          </Route>
          {/* RUTAS PUBLICAS, TODOS PUEDEN ACCEDER */}
          {/* TANTO USUARIOS NO AUTENTICADOS COMO AUTENTICADOS. */}
          <Route path="/" element={<Home />} />
          <Route path="/all-posts" element={<AllPosts />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/post/:postSlug" element={<PostPage />} />
          <Route path="/search" element={<Search />} />
          {/* RUTAS PRIVADAS, SOLO USUARIOS AUTENTICADOS PUEDEN ACCEDER */}
          {/* Solo puedo acceder al dashboard si ESTOY autenticado (PrivateRoute) */}
          {/* Es un componente al que le paso los children, y si el usuario esta autenticado, los muestra, sino, redirige a la ruta de login */}
          <Route element={<PrivateRoute />}>
            <Route path="/userDashboard" element={<Dashboard />} />
            <Route path="/update-post/:postId" element={<UpdatePost />} />
          </Route>
          {/* RUTAS PRIVADAS, SOLO USUARIOS ADMIN PUEDEN ACCEDER */}
          {/* Solo puedo acceder al dashboard si ESTOY autenticado y SOY ADMIN (AdminRoute) */}
          <Route element={<AdminRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
        {/* FOOTER */}
        <FooterComponent />
      </BrowserRouter>
    </>
  );
};
