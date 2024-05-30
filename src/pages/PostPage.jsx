import { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Modal, Spinner } from "flowbite-react";
import { useSelector } from "react-redux";
import axios from "axios";
axios.defaults.withCredentials = true;
import { CommentSection } from "../components/CommentSection";
import { PostCard } from "../components/PostCard";
import Tilt from "react-parallax-tilt";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { ScrollToTop } from "../components/ScrollToTop";

export const PostPage = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { postSlug } = useParams();
  const [post, setPost] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentPosts, setRecentPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [postIdtoDelete, setPostIdtoDelete] = useState("");
  const [postTitletoDelete, setPostTitletoDelete] = useState("");
  const [imageToDelete, setImageToDelete] = useState(null);
  const [postOwnerId, setPostOwnerId] = useState('')
  const storage = getStorage();
  const navigate = useNavigate();
  useEffect(() => {
    try {
      const getRecentPosts = async () => {
        const res = await axios.get(`/api/post/getposts?limit=4`, { withCredentials: true });
        if (res.status === 200) {
          setRecentPosts(res.data.posts);
          setRecentPosts((prev) =>
            prev.filter((post) => post.slug !== postSlug)
          );
        }
      };
      getRecentPosts();
    } catch (error) {
      console.log(error);
    }
  }, [postSlug]);

  useEffect(() => {
    try {
      const getPostBySlug = async () => {
        setIsLoading(true);
        const res = await axios.get(`/api/post/getposts?slug=${postSlug}`, { withCredentials: true });
        if (res.status === 200) {
          setIsLoading(false);
          setPost(res.data.posts[0]);
          setPostOwnerId(res.data.posts[0].userId)
        } else {
          setError("Post not found");
          setIsLoading(false);
        }
      };
      getPostBySlug();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setError("Post not found");
    }
  }, [postSlug]);

  const handleDelete = async () => {
    try {
      console.log(postIdtoDelete, currentUser._id);
      const response = await axios.delete(
        `/api/post/deletepost/${postIdtoDelete}/${postOwnerId}`, { withCredentials: true }
      );
      if (response.status === 200) {
        navigate(
          currentUser.isAdmin
            ? "/dashboard?tab=posts"
            : "/userDashboard?tab=posts"
        );
        // Crear una referencia no raíz utilizando child
        const fileRef = ref(storage, imageToDelete);
        if (imageToDelete === null) {
          return;
        } else {
          // Eliminar el archivo utilizando la referencia no raíz
          await deleteObject(fileRef);
        }
      }
    } catch (error) {
      console.log(error);
      // Manejar el error de forma adecuada
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center mt-12 min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }
  return (
    <>
      <ScrollToTop />
      {isLoading ? (
        <div className="flex w-full h-screen items-start justify-center mt-12">
          <Spinner size="xl" />
        </div>
      ) : (
        <>
          <main className="p-3 flex flex-col max-w-3xl mx-auto mt-5 h-full ">
            <Tilt
              glareEnable
              glareBorderRadius={"1.5rem"}
              scale="0.9"
              perspective="2000"
              className="relative w-full h-96"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black opacity-90 rounded-3xl lg:group-hover:bg-black lg:group-hover:bg-opacity-40 " />
              <img
                src={post && post.image}
                alt={post && post.title}
                className="w-full h-full object-cover rounded-3xl shadow-md dark:shadow-none"
              />
              <div className="absolute top-0 left-0 w-full text-center p-4">
                <h1
                  style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
                  className="text-3xl dark:text-white text-white font-bold uppercase
              lg:text-4xl drop-shadow-lg"
                >
                  {post && post.title}
                </h1>
                <span
                  style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 1)" }}
                  className="dark:text-white text-white"
                >
                  Created:{" "}
                  {post && new Date(post.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </Tilt>
            {(currentUser?.isAdmin || postOwnerId === currentUser?._id) && (
              <ul className="menu menu-vertical lg:menu-horizontal flex items-center justify-center bg-base-200 gap-4 rounded-box md:justify-evenly mt-5 font-bold">
                <li><Link className="text-center" to={`/update-post/${post._id}`}>Edit post </Link></li>
                <li><a onClick={() => {
                  setShowModal(true);
                  setPostIdtoDelete(post._id);
                  setPostTitletoDelete(post.title);
                  setImageToDelete(
                    post.image.includes(
                      "video-tutoriales-sobre-email-marketing"
                    )
                      ? null
                      : post.image
                  );
                }}
                  className="text-center"
                >Delete post</a></li>
              </ul>
            )}

            <div className="mt-5 mb-5 self-center rounded-xl dark:bg-base-300 p-6">
              <p>{post && post.content}</p>
            </div>
            <div className="self-center w-[90%] flex items-center justify-center">
              <CommentSection postId={post._id} />
            </div>
          </main>
          <div className="flex flex-col justify-center items-center mb-5">
            <h1 className="text-2xl mt-2 font-semibold">
              It may interest you
            </h1>
            {recentPosts && (
              <div className="mt-5 flex flex-wrap items-center justify-center">
                {recentPosts.slice(0, 3).map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}
            <Link to={`/all-posts`}>
              <button
                className="btn  btn-accent btn-wide my-12"
              >
                Show more posts
              </button>
            </Link>
            <Modal
              show={showModal}
              onClose={() => setShowModal(false)}
              popup
              dismissible
              size="md"
            >
              <Modal.Header />
              <Modal.Body className="flex items-center justify-center flex-col gap-3">
                <HiOutlineExclamationCircle className="text-red-500 text-6xl" />
                <h1 className="text-center text-2xl font-semibold dark:text-white">
                  Delete "{postTitletoDelete}" ?
                </h1>
                <div className="flex justify-between gap-5">
                  <Button
                    color="failure"
                    onClick={() => {
                      handleDelete();
                      setShowModal(false);
                    }}
                  >
                    Delete
                  </Button>
                  <Button
                    onClick={() => setShowModal(false)}
                    gradientDuoTone="greenToBlue"
                  >
                    Cancel
                  </Button>
                </div>
              </Modal.Body>
            </Modal>
          </div>
        </>
      )}
    </>
  );
};
