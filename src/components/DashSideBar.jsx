import React from "react";
import { Sidebar, Flowbite } from "flowbite-react";
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiUserGroup,
  HiAnnotation,
  HiCode,
} from "react-icons/hi";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { logoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

export const DashSideBar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  //Obtenemos el path actual mediante useLocation de react-router-dom
  //useLocation nos da un objeto con información sobre la ruta actual (URL)
  //Específicamente pathname devuelve lo que viene después del dominio (google.com/loquesea -> /loquesea)
  const location = useLocation();
  //En tab guardamos el valor del parámetro search de la URL, osea "?tab=valor" seria = 'valor'
  const [tab, setTab] = useState("");
  //este useEffect se va a ejecutar siempre que cambie el search osea el ?tab=valor de la url
  //se va a utilizar para mostrar diferentes componentes dentro del mismo componente
  //Cualquier componente que se muestre aca es valido dependiendo si esta era una ruta publica o privada
  useEffect(() => {
    //URLSearchParams nos devuelve un objeto con todos los parámetros de la URL
    //En este caso nos devuelve un objeto con el parámetro tab y su valor
    //search porque es el nombre del parámetro que queremos obtener
    //search = ?tab=valor
    const urlParams = new URLSearchParams(location.search);
    // urlParams.get("tab") nos devuelve el valor del parámetro tab, osea 'valor'
    const tabFromUrl = urlParams.get("tab");
    //seteamos el valor de tab con el valor del parámetro tab de la URL
    setTab(tabFromUrl);
    //y esto se va a hacer cada vez que cambie el search, osea el valor de ?tab=valor
  }, [location.search]);
  const handleSignOut = () => {
    try {
      axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/logout`);
      dispatch(logoutSuccess());
    } catch (error) {
      console.log(error);
    }
  };
  const customTheme = {
    sidebar: {
      root: {
        base: "h-full ",
        collapsed: {
          on: "w-16",
          off: "w-64",
        },
        inner:
          "h-full overflow-y-auto overflow-x-hidden rounded-xl px-3 py-4 bg-gray-300 dark:bg-gray-500 dark:bg-opacity-10",
      },
      cta: {
        base: "mt-6 rounded-lg bg-gray-100 p-4 dark:bg-gray-700",
        color: {
          blue: "bg-cyan-50 dark:bg-cyan-900",
          dark: "bg-dark-50 dark:bg-dark-900",
          failure: "bg-red-50 dark:bg-red-900",
          gray: "bg-alternative-50 dark:bg-alternative-900",
          green: "bg-green-50 dark:bg-green-900",
          light: "bg-light-50 dark:bg-light-900",
          red: "bg-red-50 dark:bg-red-900",
          purple: "bg-purple-50 dark:bg-purple-900",
          success: "bg-green-50 dark:bg-green-900",
          yellow: "bg-yellow-50 dark:bg-yellow-900",
          warning: "bg-yellow-50 dark:bg-yellow-900",
        },
      },
      item: {
        base: "flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
        active: "bg-gray-100 dark:bg-gray-700",
        collapsed: {
          insideCollapse: "group w-full pl-8 transition duration-75",
          noIcon: "font-bold",
        },
        content: {
          base: "flex-1 whitespace-nowrap px-3",
        },
        icon: {
          base: "h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
          active: "text-gray-700 dark:text-gray-100",
        },
        label: "",
        listItem: "",
      },
      items: {
        base: "",
      },
      itemGroup: {
        base: "mt-4 space-y-2 border-t border-gray-200 pt-4 first:mt-0 first:border-t-0 first:pt-0 dark:border-gray-700",
      },
      logo: {
        base: "mb-5 flex items-center pl-2.5",
        collapsed: {
          on: "hidden",
          off: "self-center whitespace-nowrap text-xl font-semibold dark:text-white",
        },
        img: "mr-3 h-6 sm:h-7",
      },
    },
  };
   
 
  return (
    <Flowbite theme={{ theme: customTheme }}>
      <Sidebar className=" w-screen p-2 md:p-0 md:w-56  z-40">
        <Sidebar.Items>
          <Sidebar.ItemGroup className="flex flex-col">
            {/* Si tab es igual a profile mostramos el item con el icono de HiUser y el label User */}

            {currentUser.isAdmin && (
              <Link to="/dashboard?tab=overview">
                <Sidebar.Item
                  active={tab === "overview"}
                  icon={HiCode}
                  labelColor="dark"
                  as="div"
                >
                  Dashboard
                </Sidebar.Item>
              </Link>
            )}

            <Link
              to={
                currentUser.isAdmin
                  ? "/dashboard?tab=profile"
                  : "/userDashboard?tab=profile"
              }
            >
              <Sidebar.Item
                active={tab === "profile"}
                icon={HiUser}
                labelColor="dark"
                as="div"
              >
                My Profile
              </Sidebar.Item>
            </Link>

            <Link
              to={
                currentUser.isAdmin
                  ? "/dashboard?tab=posts"
                  : "/userDashboard?tab=posts"
              }
            >
              <Sidebar.Item
                active={tab === "posts"}
                icon={HiDocumentText}
                labelColor="dark"
                as="div"
              >
                My Posts
              </Sidebar.Item>
            </Link>

            {currentUser.isAdmin && (
              <Link to="/dashboard?tab=users">
                <Sidebar.Item
                  active={tab === "users"}
                  icon={HiUserGroup}
                  labelColor="dark"
                  as="div"
                >
                  Users
                </Sidebar.Item>
              </Link>
            )}

            {currentUser.isAdmin && (
              <Link to="/dashboard?tab=comments">
                <Sidebar.Item
                  active={tab === "comments"}
                  icon={HiAnnotation}
                  labelColor="dark"
                  as="div"
                >
                  Comments
                </Sidebar.Item>
              </Link>
            )}

            <Link to="/signin">
              <Sidebar.Item
                icon={HiArrowSmRight}
                onClick={handleSignOut}
                as="div"
              >
                Sign Out
              </Sidebar.Item>
            </Link>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </Flowbite>
  );
};
