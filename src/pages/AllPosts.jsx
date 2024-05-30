import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
axios.defaults.withCredentials = true;
import { Button, Spinner, Table } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { ScrollToTop } from "../components/ScrollToTop";
import { PostCard } from "../components/PostCard";

export const AllPosts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [allPosts, setAllPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/post/getposts?limit=8`, { withCredentials: true });
        const { data } = res;
        if (res.status === 200) {
          setAllPosts(data.posts);
          setLoading(false);
          if (data.posts.length < 4) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchTotalPosts = async () => {
      const res1 = await axios.get(`/api/post/getposts`, { withCredentials: true });
      const { data } = res1;
      const { totalPosts: totalPosts2 } = data;
      const totalPostsRest = totalPosts2 - 8;
      setTotalPosts(totalPostsRest);
    };
    fetchTotalPosts();
  }, []);

  const handleShowMore = async () => {
    const totalPostsRest = totalPosts - 4; // 9 5 1
    setTotalPosts(totalPostsRest);
    const numberOfPosts = allPosts.length;
    const startIndex = numberOfPosts;
    const response = await axios.get(
      `/api/post/getposts?startIndex=${startIndex}`, { withCredentials: true }
    );
    const data = response?.data;
    if (response.status !== 200) {
      return;
    }
    if (response.status === 200 && data.posts.length > 0) {
      setAllPosts([...allPosts, ...data.posts]);
      if (data.posts.length < 4 || totalPostsRest === 0) {
        setShowMore(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex w-full h-screen items-start justify-center mt-12">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      {loading ? (
        <div className="flex w-full h-screen items-start justify-center mt-12">
          <Spinner size="xl" />
        </div>
      ) : (
        <div className="w-screen flex flex-col items-center justify-start mt-12 min-h-screen">
          {allPosts.length > 0 ? (
            <>
              <div className="mt-5 flex flex-wrap items-center justify-center">
                {allPosts?.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
              {showMore && (
                <Link to={`/all-posts`}>
                  <button
                    onClick={handleShowMore}
                    className="btn  btn-accent btn-wide my-12"
                  >
                    Show more posts
                  </button>
                </Link>
              )}
            </>
          ) : (
            <div className="h-screen text-center text-2xl">
              <p> There are no posts yet.</p>
              <button
                className="mx-auto mt-5 p-0"
                onClick={() =>
                  navigate(`${currentUser ? "/create-post" : "/signin"}`)
                }
              >
                Create a post
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};
