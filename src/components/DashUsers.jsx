import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
axios.defaults.withCredentials = true;
import { Button, Modal, Spinner, Table } from "flowbite-react";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { FaCheck, FaTimes } from "react-icons/fa";
export const DashUsers = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdtoDelete, setUserIdtoDelete] = useState("");
  const [usertoDelete, setUsertoDelete] = useState("");
  const [imageToDelete, setImageToDelete] = useState(null);
  const [userPic, setUserPic] = useState(null)
  const [loading, setLoading] = useState(false);
  const storage = getStorage();

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await axios.get(`/api/user/getusers?startIndex=${startIndex}`, { withCredentials: true });
      if (res.statusText === "OK") {
        setUsers([...users, ...res.data.users]);
        if (res.data.users.length < 17) {
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
        `/api/user/deleteuser/${userIdtoDelete}`, { withCredentials: true }
      );

      if (response.status === 200) {
        setUsers(users.filter((user) => user._id !== userIdtoDelete));
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
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/user/getusers`, { withCredentials: true });

        const { data } = res;
        if (res.status === 200) {
          setUsers(data.users);
          setLoading(false);
          if (data.users.length < 16) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);
  if (loading) {
    return (
      <div className="flex h-screen w-full items-start justify-center mt-12">
        <Spinner size="xl" />
      </div>
    );
  }
  return (
    <div className="p-2 md:p-6 overflow-x-scroll md:mx-auto scrollbar">
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                 
                  <th>Image</th>
                  <th>Admin?</th>
                  <th>Date</th>
                  <th>Delete</th>
               
                  <th></th>
                </tr>
              </thead>
              {users?.map((user) => (
              <tbody>
                {/* row 1 */}
                <tr>
                  
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                            <img src={user.profilePic}
                              alt={user.username} />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{user.username}</div>
                        <div className="text-sm opacity-50">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                      {user.isAdmin ? (
                        <FaCheck className="text-emerald-500" />
                      ) : (
                        <FaTimes className="text-red-500" />
                      )}
                  </td>
                    <td> {new Date(user.updatedAt).toLocaleDateString()}</td>
                  <th>
                      <span
                        onClick={() => {
                          document.getElementById('deleteUserByAdmin').showModal();
                          setUserIdtoDelete(user._id);
                          setUsertoDelete(user.username);
                          setUserPic(user.profilePic);
                          setImageToDelete(
                            user.profilePic.includes(
                              "video-tutoriales-sobre-email-marketing"
                            )
                              ? null
                              : user.profilePic
                          );
                        }}
                        className="cursor-pointer text-red-500 font-medium hover:underline"
                      >
                        Delete
                      </span>
                  </th>
                </tr>
               
                
              </tbody>
              ))}
            </table>
          </div>
          
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
          There are no users yet
        </div>
      )}
      <dialog id="deleteUserByAdmin" className="modal">
        <div className="modal-box">
<div className="flex items-center justify-between">

          <h3 className="font-bold text-lg line-clamp-2">Delete "{usertoDelete}" ?</h3>
          <img src={userPic} className="w-24 h-auto object-cover rounded-lg" />
</div>
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
