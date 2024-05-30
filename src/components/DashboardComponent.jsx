import React, { useEffect, useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
import { useSelector } from "react-redux";
import { FaCheck, FaTimes } from "react-icons/fa";
import {
  HiArrowNarrowUp,
  HiOutlineAnnotation,
  HiOutlineArchive,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { Table } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { PostCard } from "./PostCard";
export const DashboardComponent = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [lastMonthUser, setLastMonthUser] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersFetch = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/getUsers?limit=3`, { withCredentials: true });
        if (usersFetch.status === 200) {
          setUsers(usersFetch.data.users);
          setTotalUsers(usersFetch.data.totalUsers);
          setLastMonthUser(usersFetch.data.lastMonth);

        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchPosts = async () => {
      try {
        const postsFetch = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/post/getPosts?limit=3`, { withCredentials: true });
        if (postsFetch.status === 200) {
          setPosts(postsFetch.data.posts);
          setTotalPosts(postsFetch.data.totalPosts);
          setLastMonthPosts(postsFetch.data.lastMonth);

        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchComments = async () => {
      try {
        const commentsFetch = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/comment/getComments?limit=3`, { withCredentials: true }
        );
        if (commentsFetch.status === 200) {
          setComments(commentsFetch.data.comments);
          setTotalComments(commentsFetch.data.totalComments);
          setLastMonthComments(commentsFetch.data.lastMonth);

        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);

  return (
    <div className="w-full flex items-start flex-wrap mt-2 p-4">
      {/* ESTADISTICAS USUARIOS */}
      <div className=" h-fit w-full  p-3 lg:flex-1 min-w-64">
        <div className="flex flex-col  p-3 bg-base-200 gap-4  w-full rounded-2xl shadow-md">
          <div className="flex justify-between ">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase ">Total Users</h3>
              <p className="text-2xl">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className="h-10 w-10 bg-teal-500 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center justify-center">
              <HiArrowNarrowUp />
              {lastMonthUser}
            </span>
            <div className="text-gray-500">Last Month</div>
          </div>
        </div>
      </div>
      {/* ESTADISTICAS COMENTARIOS */}
      <div className="md:mx-auto h-fit w-full md:w-auto p-3 lg:flex-1 min-w-64">
        <div className="flex  flex-col p-3 bg-base-200 gap-4  w-full rounded-2xl shadow-md">
          <div className="flex justify-between ">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase ">
                Total Comments
              </h3>
              <p className="text-2xl">{totalComments}</p>
            </div>
            <HiOutlineAnnotation className="h-10 w-10 bg-blue-800 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center justify-center">
              <HiArrowNarrowUp />
              {lastMonthComments}
            </span>
            <div className="text-gray-500">Last Month</div>
          </div>
        </div>
      </div>
      {/* ESTADISTICAS POSTS */}
      <div className="md:mx-auto  h-fit w-full md:w-auto p-3 lg:flex-1 min-w-64">
        <div className="flex flex-col  p-3 bg-base-200 gap-4  w-full rounded-2xl shadow-md">
          <div className="flex justify-between ">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase ">Total Posts</h3>
              <p className="text-2xl">{totalPosts}</p>
            </div>
            <HiOutlineArchive className="h-10 w-10 bg-emerald-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center justify-center">
              <HiArrowNarrowUp />
              {lastMonthPosts}
            </span>
            <div className="text-gray-500">Last Month</div>
          </div>
        </div>
      </div>

      {/* TABLAS DE USUARIO COMENTARIOS Y POSTS */}
      <div className="p-4 self-start flex flex-wrap gap-4  mx-auto justify-center">
        {/* MANEJO DE USUARIOS */}
        <div className="flex  flex-col shadow-md rounded-lg bg-base-200 w-full md:flex-1">
          <div className="flex items-center justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Users</h1>
            <button outline gradientDuoTone="purpleToPink">
              <Link to={"/dashboard?tab=users"}>See all</Link>
            </button>
          </div>
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

                  </tr>


                </tbody>
              ))}
            </table>
          </div>
        </div>

        {/* MANEJO DE COMENTARIOS */}
        <div className="flex  flex-col  min-w-80 shadow-md rounded-lg bg-base-200 w-full md:flex-1">
          <div className="flex items-center justify-between p-3 text-sm font-semibold ">
            <h1 className="text-center p-2">Recent Comments</h1>
            <button outline gradientDuoTone="purpleToPink">
              <Link to={"/dashboard?tab=comments"}>See all</Link>
            </button>
          </div>
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
                                  </tr>
                </tbody>
              ))}
            </table>
          </div>
        </div>

        {/* MANEJO DE POSTS */}
        <div className="flex  flex-col shadow-md rounded-lg bg-base-200 w-full ">
          <div className="flex items-center justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Posts</h1>
            <button outline gradientDuoTone="purpleToPink">
              <Link to={"/all-posts"}>See all</Link>
            </button>
          </div>
          {posts.length > 0 && (
            <>
              <div className="mt-5 flex flex-wrap items-center justify-center">
                {posts?.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>

            </>
          )}
        </div>
      </div>
    </div>
  );
};
