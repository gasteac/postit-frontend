import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Button, Modal, Spinner, Table } from "flowbite-react";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { FaCheck, FaTimes } from "react-icons/fa";

export const DashComments = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdtoDelete, setCommentIdtoDelete] = useState("");
  const [commentToDelete, setCommentToDelete] = useState("");
  const [loading, setLoading] = useState(false);
  const storage = getStorage();

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/comment/getComments?startIndex=${startIndex}`, { withCredentials: true }
      );
      if (res.statusText === "OK") {
        setComments([...comments, ...res.data.comments]);
        if (res.data.comments.length < 8) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/comment/deleteComment/${commentIdtoDelete}`, { withCredentials: true }
      );

      if (response.status === 200) {
        setComments(
          comments.filter((comment) => comment._id !== commentIdtoDelete)
        );
      }
    } catch (error) {
      console.log(error);
      // Manejar el error de forma adecuada
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/comment/getComments`, { withCredentials: true });

        const { data } = res;
        if (res.status === 200) {
          setComments(data.comments);
          setLoading(false);
          if (data.comments.length < 8) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]);

  if (loading) {
    return (
      <div className="flex w-full items-start justify-center mt-12">
        <Spinner size="xl" />
      </div>
    );
  }
  return (
    <div className="p-2 md:max-w-[80%] md:p-6 h-screen table-auto overflow-x-scroll md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-transparent dark:scrollbar-thumb-transparent">
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className="bg-white dark:bg-slate-800 rounded-xl">
            <Table.Head>
              <Table.HeadCell className="text-nowrap">
                date created
              </Table.HeadCell>
              <Table.HeadCell className="text-wrap">Content</Table.HeadCell>
              <Table.HeadCell className="text-nowrap">
                Number of likes
              </Table.HeadCell>
              <Table.HeadCell className="text-nowrap">Post ID</Table.HeadCell>
              <Table.HeadCell className="text-nowrap">User ID</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {comments?.map((comment) => (
              <Table.Body key={comment._id} className="divide-y-2">
                <Table.Row>
                  <Table.Cell as="div">
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </Table.Cell>

                  <Table.Cell className="font-medium line-clamp-1">
                    {comment.content}
                  </Table.Cell>
                  <Table.Cell className="font-medium ">
                    {comment.numberOfLikes}
                  </Table.Cell>
                  <Table.Cell className="font-medium ">
                    {comment.postId}
                  </Table.Cell>
                  <Table.Cell className="font-medium ">
                    {comment.userId}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdtoDelete(comment._id);
                        setCommentToDelete(comment.content);
                      }}
                      className="cursor-pointer text-red-500 font-medium hover:underline"
                    >
                      Delete
                    </span>
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
          There are no comments yet
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
          <h1 className="text-center text-2xl font-semibold dark:text-white">
            Delete this comment ?
          </h1>
          <p className="line-clamp-2 mb-2 dark:text-white">{commentToDelete}</p>
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
