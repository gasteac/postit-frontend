import React, { useEffect, useState } from "react";
import {
  Button,
  Dropdown,
  Navbar,
  NavbarLink,
  NavbarToggle,
  TextInput,
} from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { logoutSuccess } from "../redux/user/userSlice";
import axios from "axios";
axios.defaults.withCredentials = true;
import { DarkThemeToggle } from "flowbite-react";
export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  //Obtenemos el path actual mediante useLocation de react-router-dom
  //useLocation nos da un objeto con información sobre la ruta actual (URL)
  //Específicamente pathname devuelve lo que viene después del dominio (google.com/loquesea -> /loquesea)
  const path = useLocation().pathname;
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    } else {
      setSearchTerm("");
    }
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    navigate(`/search?searchTerm=${searchTerm}&order=desc&category=unselected`);
  };

  const handleSignOut = () => {
    try {
      axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/logout`, { withCredentials: true });
      dispatch(logoutSuccess());
      navigate("/signin");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Navbar className="border-b-4 w-full sticky top-0 z-50">
      <Link
        to="/"
        className="lowEndPhone:inline text-sm font-semibold  dark:text-white"
      >
        <span className="hidden sm:block px-2 py-1 hiText font-bold text-2xl sm:text-2xl ">
          FaceRook
        </span>
      </Link>
      {!path.includes("search") && (
        <form onSubmit={handleSubmit}>
          <TextInput
            type="text"
            placeholder={searchTerm ? searchTerm : "Search"}
            rightIcon={AiOutlineSearch}
            className="hidden lg:inline"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      )}

      <div className="flex gap-2 md:order-2">
        <DarkThemeToggle />
        {/* Si el usuario esta logueado mostramos un dropdown con su avatar, si no mostramos un botón para loguearse */}
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <img
                src={currentUser.profilePic}
                alt="avatar"
                className="h-10 w-10 object-cover rounded-full"
              />
            }
          >
            <Link
              to={
                currentUser.isAdmin
                  ? "/dashboard?tab=profile"
                  : "/userDashboard?tab=profile"
              }
            >
              <Dropdown.Item as="div">{currentUser.username}</Dropdown.Item>
            </Link>
            {currentUser.isAdmin && (
              <Link to={"/dashboard?tab=overview"}>
                <Dropdown.Divider />

                <Dropdown.Item as="div">Dashboard</Dropdown.Item>
              </Link>
            )}
            <Dropdown.Divider />

            <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          // Si no esta logueado mostramos el boton para ingresar o registrarse
          <>
            <Link to="signup">
              <Button gradientDuoTone="greenToBlue" outline>
                Sign Up
              </Button>
            </Link>
            <Link to="signin">
              <Button gradientDuoTone="purpleToBlue" outline>
                Sign In
              </Button>
            </Link>
          </>
        )}

        <NavbarToggle></NavbarToggle>
      </div>
      <Navbar.Collapse>
        {/* path lo obtenemos de useLocation, es el path actual, lo que esta en la url */}

        {!currentUser ? (
          <>
            <NavbarLink
              active={path === "/"}
              as="div"
              className={`
    rounded-xl w-full
    ${
      path === "/"
        ? "bg-gradient-to-br from-purple-500 to-blue-500 md:text-white font-semibold"
        : "dark:text-white light:text-black"
    }
  `}
            >
              <Link to="/" className="w-full flex md:p-2 ">
                Home
              </Link>
            </NavbarLink>
            <NavbarLink
              active={path === "/all-posts"}
              as="div"
              className={`
    rounded-xl w-full
    ${
      path === "/all-posts"
        ? "bg-gradient-to-br from-purple-500 to-blue-500 md:text-white font-semibold"
        : "dark:text-white light:text-black"
    }
  `}
            >
              <Link to="/all-posts" className="w-full flex md:p-2">
                All Posts
              </Link>
            </NavbarLink>
            <NavbarLink
              active={path === "/create-post"}
              as="div"
              className={`
    rounded-xl w-full
    ${
      path === "/create-post"
        ? "bg-gradient-to-br from-purple-500 to-blue-500 md:text-white font-semibold"
        : "dark:text-white light:text-black"
    }
  `}
            >
              <Link to="/create-post" className="w-full flex md:p-2">
                Create Post
              </Link>
            </NavbarLink>
            <NavbarLink
              active={path === "/search"}
              as="div"
              className={`
    rounded-xl w-full md:hidden
    ${
      path === "/search"
        ? "bg-gradient-to-br from-purple-500 to-blue-500 md:text-white font-semibold"
        : "dark:text-white light:text-black"
    }
  `}
            >
              <Link to="/search" className="w-full flex md:p-2">
                Search
              </Link>
            </NavbarLink>
          </>
        ) : (
          <>
            {currentUser.isAdmin ? (
              <NavbarLink
                active={path === "/dashboard"}
                as="div"
                className={`
    rounded-xl w-full 
    ${
      path === "/dashboard"
        ? "bg-gradient-to-br from-purple-500 to-blue-500 md:text-white font-semibold"
        : "dark:text-white light:text-black"
    }
  `}
              >
                <Link
                  to="/dashboard?tab=overview"
                  className="w-full flex md:p-2"
                >
                  Dashboard
                </Link>
              </NavbarLink>
            ) : (
              <NavbarLink
                active={path === "/userDashboard"}
                as="div"
                className={`
    rounded-xl w-full 
    ${
      path === "/userDashboard"
        ? "bg-gradient-to-br from-purple-500 to-blue-500 md:text-white font-semibold"
        : "dark:text-white light:text-black"
    }
  `}
              >
                <Link
                  to={
                    currentUser.isAdmin
                      ? "/dashboard?tab=profile"
                      : "/userDashboard?tab=profile"
                  }
                  className="w-full flex md:p-2"
                >
                  My profile
                </Link>
              </NavbarLink>
            )}

            <NavbarLink
              active={path === "/all-posts"}
              as="div"
              className={`
    rounded-xl w-full
    ${
      path === "/all-posts"
        ? "bg-gradient-to-br from-purple-500 to-blue-500 md:text-white font-semibold"
        : "dark:text-white light:text-black"
    }
  `}
            >
              <Link to="/all-posts" className="w-full flex md:p-2">
                All Posts
              </Link>
            </NavbarLink>
            <NavbarLink
              active={path === "/create-post"}
              as="div"
              className={`
    rounded-xl w-full
    ${
      path === "/create-post"
        ? "bg-gradient-to-br from-purple-500 to-blue-500 md:text-white font-semibold"
        : "dark:text-white light:text-black"
    }
  `}
            >
              <Link to="/create-post" className="w-full flex md:p-2">
                Create Post
              </Link>
            </NavbarLink>
          </>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};
