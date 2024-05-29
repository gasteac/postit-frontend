import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  DashProfile,
  DashSideBar,
  DashUsers,
  DashPosts,
  DashComments,
  DashboardComponent,
} from "../components";
import { ScrollToTop } from "../components/ScrollToTop";

export const Dashboard = () => {
  //location nos devuelve un objeto con información de la URL actual y los parametros
  const location = useLocation();
  const [tab, setTab] = useState(null);
  //este useEffect se va a ejecutar siempre que cambie el search osea el ?tab=valor de la url
  //se va a utilizar para mostrar diferentes componentes dentro del mismo componente
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    //urlParams nos devuelve un objeto con los parámetros de la URL q coincidan con en este caso search que es ?tab=valor
    const tabFromUrl = urlParams.get("tab");
    // tabFromUrl nos devuelve el valor del parámetro tab, puede ser en nuestro caso profile por ejemplo
    setTab(tabFromUrl);
  }, [location.search]);
  return (
    <div className="flex relative flex-col md:flex-row w-screen min-h-screen ">
      <ScrollToTop />
      <div className="md:min-w-56" />
      <div className=" md:fixed top-[12%] left-0">
        <DashSideBar />
      </div>
      {/* posts */}
      {tab === "overview" ? <DashboardComponent /> : null}
      {/* posts */}
      {tab === "posts" ? <DashPosts /> : null}
      {/* profile */}
      {tab === "profile" ? <DashProfile /> : null}
      {/* users */}
      {tab === "users" ? <DashUsers /> : null}
      {/* comments */}
      {tab === "comments" ? <DashComments /> : null}
    </div>
  );
};
