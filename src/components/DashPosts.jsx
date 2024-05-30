import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
axios.defaults.withCredentials = true;
import { Button, Modal, Spinner, Table } from "flowbite-react";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { PostCard } from "./PostCard";
export const DashPosts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdtoDelete, setPostIdtoDelete] = useState("");
  const [postTitletoDelete, setPostTitletoDelete] = useState("");
  const [imageToDelete, setImageToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);
  const navigate = useNavigate();
  const storage = getStorage();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/post/getposts?userId=${currentUser._id}&limit=6`, { withCredentials: true }
        );
        const { data } = res;
        if (res.status === 200) {
          setUserPosts(data.posts);
          setLoading(false);
          if (data.posts.length < 6) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchPosts();
  }, [currentUser._id]);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/post/deletepost/${postIdtoDelete}/${currentUser._id}`, { withCredentials: true }
      );

      if (response.status === 200) {
        setUserPosts(userPosts.filter((post) => post._id !== postIdtoDelete));
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

  useEffect(() => {
    const fetchTotalPosts = async () => {
      const res1 = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/post/getposts?userId=${currentUser._id}`, { withCredentials: true }
      );
      const { data } = res1;
      const { totalPosts: totalPosts2 } = data;
      const totalPostsRest = totalPosts2 - 6;
      setTotalPosts(totalPostsRest);
    };
    fetchTotalPosts();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const totalPostsRest = totalPosts - 6; // 9 5 1
    setTotalPosts(totalPostsRest);
    const numberOfPosts = userPosts.length; //4
    const startIndex = numberOfPosts; // 4
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`, { withCredentials: true }
    );
    const data = response?.data;
    if (response.status !== 200) {
      return;
    }
    if (response.status === 200 && data.posts.length > 0) {
      setUserPosts([...userPosts, ...data.posts]);
      if (data.posts.length < 6 || totalPostsRest < 1) {
        setShowMore(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-start justify-center mt-12">
        <Spinner size="xl" />
      </div>
    );
  }
  return (
    <div className="p-2 md:p-6 md:mx-auto">
      {userPosts.length > 0 ? (
        <>
          <div className="mt-5 flex flex-wrap items-center justify-center">
            {userPosts?.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
          {showMore && (
            <button
              className="btn mt-4 w-full mb-5"
              onClick={handleShowMore}
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <div className="h-screen text-center text-2xl">
          <p> You have no posts yet.</p>
          <button className="btn mt-4" onClick={() => navigate("/create-post")}>
            Create a post
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </button>
        </div>
      )}

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
  );
};
