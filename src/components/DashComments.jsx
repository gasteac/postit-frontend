import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
axios.defaults.withCredentials = true;
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
        `/api/comment/getComments?startIndex=${startIndex}`, { withCredentials: true }
      );
      if (res.statusText === "OK") {
        setComments([...comments, ...res.data.comments]);
        if (res.data.comments.length < 16) {
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
        `/api/comment/deleteComment/${commentIdtoDelete}`, { withCredentials: true }
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
        const res = await axios.get(`/api/comment/getComments`, { withCredentials: true });

        const { data } = res;
        if (res.status === 200) {
          setComments(data.comments);
          setLoading(false);
          if (data.comments.length < 16) {
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
    <div className="p-2  md:p-6  w-full scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 min-h-screen">
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <div className="overflow-x-auto p-8 h-xl">
            <table className="table table-xs table-pin-cols">
              <thead>
                <tr>
                  <td>Date</td>
                  <td>Comment</td>
                  <td>PostId</td>
                  <td>UserId</td>
                </tr>
              </thead>
              {comments?.map((comment) => (
                <tbody>
                  <tr key={comment._id} >
                    <td>{new Date(comment.updatedAt).toLocaleDateString()}</td>
                    <td className="md:max-w-xl">{comment.content}</td>
                    <td>{comment.postId}</td>
                    <td>{comment.userId}</td>
                    <span
                      onClick={() => {
                        document.getElementById('deleteComment').showModal();
                        setCommentIdtoDelete(comment._id);
                        setCommentToDelete(comment.content);
                      }}
                      className="cursor-pointer text-red-400 font-medium hover:underline"
                    >
                      Delete
                    </span>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
          {/* <Table hoverable className="bg-white dark:bg-slate-800 rounded-xl">
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
          </Table> */}
          {showMore && (
            <button
              onClick={handleShowMore}
              className="btn btn-neutral my-5 w-full"            >
              Show more
            </button>
          )}
        </>
      ) : (
        <div className="h-screen text-center text-2xl">
          There are no comments yet
        </div>
      )}
      <dialog id="deleteComment" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg line-clamp-2">Delete "{commentToDelete}" ?</h3>
          <p className="py-4">This action is irreversible.</p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button onClick={() => {
                handleDelete();
              }} className="btn text-red-600">Delete</button>
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
     
    </div>
  );
};
