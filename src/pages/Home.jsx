import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Spinner } from "flowbite-react";
import axios from "axios";
import { PostCard } from "../components/PostCard";
import Tilt from "react-parallax-tilt";

export const Home = () => {
  // utilizamos useParams() que nos devuelve los parámetros q estan en la URL
  const { postSlug } = useParams();
  const [recentPosts, setRecentPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const getRecentPosts = async () => {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/post/getposts?limit=9`);
        if (res.status === 200) {
          setIsLoading(false);
          setRecentPosts(res.data.posts);
        }
      };
      getRecentPosts();
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }, [postSlug]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center mt-12 min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="w-screen flex flex-col  items-center justify-center mt-12 min-h-screen ">
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
              className="hiText capitalize font-bold cursor-pointer hover:brightness-150 transition duration-300 ease-in-out"
            >
              {currentUser.username}!
            </span>

            <Tilt scale="1.2" perspective="2000">
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
            </Tilt>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <h1 className="capitalize">Welcome</h1>
            <span className="hiText capitalize font-bold">Visitor!</span>
          </div>
        )}
      </div>

      {recentPosts && (
        <div className="mt-5 flex flex-wrap items-center justify-center">
          {recentPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}

      <Link to={`/all-posts`}>
        <Button
          gradientDuoTone="purpleToBlue"
          outline
          className="w-full hover:brightness-90 dark:hover:brightness-115 p-1 mb-5 self-center "
        >
          See all posts
        </Button>
      </Link>
    </div>
  );
};
