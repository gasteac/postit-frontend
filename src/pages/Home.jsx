import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Spinner } from "flowbite-react";
import axios from "axios";
axios.defaults.withCredentials = true;
import { ScrollToTop } from "../components/ScrollToTop";

export const Home = () => {
  // utilizamos useParams() que nos devuelve los parámetros q estan en la URL
  const { postSlug } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center mt-12 min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-start mt-12">
      <ScrollToTop />
      <div className="text-4xl lg:text-5xl text-center mb-5">
        {currentUser ? (
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <h1 className="capitalize">Welcome</h1>
            <span
              onClick={() =>
                navigate(
                  currentUser.isAdmin
                    ? "/dashboard?tab=profile"
                    : "/userDashboard?tab=profile"
                )
              }
              className="hiText capitalize font-bold tracking-wide cursor-pointer hover:brightness-150 transition duration-300 ease-in-out"
            >
              {currentUser.username}!
            </span>
            <div
              onClick={() =>
                navigate(
                  currentUser.isAdmin
                    ? "/dashboard?tab=profile"
                    : "/userDashboard?tab=profile"
                )
              }
              className="h-16 w-16 lg:h-24 lg:w-24 ml-2 cursor-pointer rounded-full overflow-hidden shadow-black shadow-2xl transition duration-300 ease-in-out"
            >
              <img
                src={currentUser.profilePic}
                alt={currentUser.username}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <h1 className="capitalize">Welcome</h1>
            <span className="hiText capitalize font-bold">Visitor!</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {currentUser ? ( <><Link
          to={
            currentUser.isAdmin
              ? "/dashboard?tab=profile"
              : "/userDashboard?tab=profile"
          }
        >
          <button
            className="btn btn-outline  btn-wide"
          >
            My profile
          </button>
        </Link>
      
        <Link to={`/all-posts`}>
          <button
            className="btn btn-outline  btn-wide"
          >
            See all posts
          </button>
        </Link>
        <Link to={`/create-post`}>
          <button
            className="btn btn-outline  btn-wide"
          >
            Create a post
          </button>
        </Link>
        </>) : (<>
            <Link to={`/all-posts`}>
              <button
                className="btn btn-outline btn-wide"
              >
                See all posts
              </button>
            </Link>
            <Link to={`/signin`}>
              <button
                className="btn btn-outline btn-wide"
              >
                Sign In
              </button>
            </Link>
        </>)}
      </div>
    </div>
  );
};
