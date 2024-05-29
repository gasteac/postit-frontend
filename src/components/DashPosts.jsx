import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
axios.defaults.withCredentials = true;
import { Button, Modal, Spinner, Table } from "flowbite-react";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
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
          `${import.meta.env.VITE_BACKEND_URL}/api/post/getposts?userId=${currentUser._id}&limit=4`, { withCredentials: true }
        );
        const { data } = res;
        if (res.status === 200) {
          setUserPosts(data.posts);
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
      const totalPostsRest = totalPosts2 - 4;
      setTotalPosts(totalPostsRest);
    };
    fetchTotalPosts();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const totalPostsRest = totalPosts - 4; // 9 5 1
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
      if (data.posts.length < 4 || totalPostsRest < 1) {
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
    <div className="p-2 md:p-6 table-auto overflow-x-scroll md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-transparent dark:scrollbar-thumb-transparent">
      {userPosts.length > 0 ? (
        <>
          <Table hoverable className="bg-white dark:bg-slate-800 rounded-xl">
            <Table.Head>
              <Table.HeadCell className="text-nowrap">
                Post Image
              </Table.HeadCell>
              <Table.HeadCell className="text-nowrap">
                Post Title
              </Table.HeadCell>
              <Table.HeadCell className="text-nowrap">
                Date updated
              </Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            {userPosts?.map((post) => (
              <Table.Body key={post._id} className="divide-y-2 ">
                <Table.Row>
                  <Table.Cell as="div">
                    <Link to={`/post/${post.slug}`}>
                      <div className="w-32 h-20 bg-transparent">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="object-cover w-full h-full rounded-lg"
                        />
                      </div>
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link className="font-medium" to={`/post/${post.slug}`}>
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell className="font-medium ">
                    {" "}
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell className="font-medium">
                    {post.category}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
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
                      className="cursor-pointer text-red-500 font-medium hover:underline"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/update-post/${post._id}`}>
                      <span className="text-teal-500 font-medium hover:underline">
                        Edit
                      </span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <Button
            gradientDuoTone="purpleToBlue"
            outline
              onClick={handleShowMore}
              className="hover:brightness-90 dark:hover:brightness-115 p-1 my-5 self-center mx-auto"
            >
              Show more
            </Button>
          )}
        </>
      ) : (
        <div className="h-screen text-center text-2xl">
          <p> You have no posts yet.</p>
          <Button
            className="mx-auto mt-5 p-0"
            onClick={() => navigate("/create-post")}
          >
            Create a post
          </Button>
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
