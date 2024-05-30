import React, { useEffect, useState } from "react";
import {
  Button,
  Dropdown,
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
export const Navbar = () => {
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
      axios.post(`/api/user/logout`, { withCredentials: true });
      dispatch(logoutSuccess());
      navigate("/signin");
    } catch (error) {
      console.log(error);
    }
  };
 
  return (
    <div className="navbar bg-base-200 justify-between gap-4 p-4">
      <div className="flex gap-2">
        <Link to="/">
        <span className="btn text-xl">POST IT!</span>
        </Link>
       
      </div>
      
      <div className="hidden lg:flex">
        <div className="navbar-center items-center lg:flex gap-4">
          <ul className=" menu-horizontal px-1 text-xl">
            <li> <Link to="/" className={`w-full flex p-2 ${path === "/"
              ? "font-semibold  text-white"
              : ""
                }` }>Home</Link></li>
            <li> <Link to="/all-posts" className={`w-full flex p-2 ${path === "/all-posts"
              ? "font-semibold  text-white"
              : ""
              }`}>Posts</Link></li>
            <li> <Link to="/create-post" className={`w-full flex p-2 ${path === "/create-post"
              ? "font-semibold  text-white"
              : ""
              }`}>Create</Link></li>
          </ul>
          <Link to="/search?">
            <div className="form-control cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
            </div>
          </Link>
        </div>
      </div>
    
      {currentUser ? (
        <div className="dropdown dropdown-end ">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img src={currentUser.profilePic}
                alt="avatar" />
            </div>
          </div>
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box">
            <li>
              <Link
                to={
                  currentUser.isAdmin
                    ? "/dashboard?tab=profile"
                    : "/userDashboard?tab=profile"
                }
              >
              <span>Profile</span>
              </Link>
            </li>
                {currentUser.isAdmin && (
              <li>
                  <Link to={"/dashboard?tab=overview"}>
                    Dashboard
                  </Link>
                </li>
              )}
            
            <li><a onClick={handleSignOut}>Logout</a></li>
          </ul>
        </div>

      ) : (<>
        <div className="flex gap-2">
          <Link to="signin">
              <button className="btn btn-outline">Sign In</button>
          </Link>
          <Link to="signup">
              <button className="btn btn-outline btn-primary">Sign Up</button>
          </Link>
        </div>
      </>)}
      <div className="dropdown dropdown-bottom dropdown-end lg:hidden">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </div>
        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box">
          <li> <Link to="/" className={`w-full flex p-2 ${path === "/"
            ? "font-semibold  text-white"
            : ""
            }`}>Home</Link></li>
          <li> <Link to="/all-posts" className={`w-full flex p-2 ${path === "/all-posts"
            ? "font-semibold  text-white"
            : ""
            }`}>Posts</Link></li>
          <li> <Link to="/create-post" className={`w-full flex p-2 ${path === "/create-post"
            ? "font-semibold  text-white"
            : ""
            }`}>Create</Link></li>
          <li> <Link to="/search" className={`w-full flex p-2 ${path === "/search"
            ? "font-semibold  text-white"
            : ""
            }`}>Search</Link></li>
        </ul>
      </div>
    </div>
  );
};
