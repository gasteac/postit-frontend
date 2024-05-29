import React, { useEffect, useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
import { useSelector } from "react-redux";
import {
  HiArrowNarrowUp,
  HiOutlineAnnotation,
  HiOutlineArchive,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { Button, Table } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
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
    <div className="w-full flex items-start flex-wrap mt-2">
      {/* ESTADISTICAS USUARIOS */}
      <div className="md:mx-auto  h-fit w-full md:w-auto p-3 lg:flex-1 min-w-64">
        <div className="flex flex-col bg-white p-3 dark:bg-slate-800 gap-4  w-full rounded-2xl shadow-md">
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
        <div className="flex bg-white flex-col p-3 dark:bg-slate-800 gap-4  w-full rounded-2xl shadow-md">
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
        <div className="flex flex-col bg-white p-3 dark:bg-slate-800 gap-4  w-full rounded-2xl shadow-md">
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
        <div className="flex bg-white flex-col shadow-md rounded-lg dark:bg-gray-800 w-full md:flex-1">
          <div className="flex items-center justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Users</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to={"/dashboard?tab=users"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>email</Table.HeadCell>
              <Table.HeadCell className="text-center">Username</Table.HeadCell>
            </Table.Head>
            {users &&
              users.map((user) => (
                <Table.Body key={user._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <img
                        src={user.profilePic}
                        alt={user.username}
                        className="h-16 w-24 rounded-full object-cover bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell className="w-36 text-center">
                      {user.username}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>

        {/* MANEJO DE COMENTARIOS */}
        <div className="flex bg-white flex-col  min-w-80 shadow-md rounded-lg dark:bg-gray-800 w-full md:flex-1">
          <div className="flex items-center justify-between p-3 text-sm font-semibold ">
            <h1 className="text-center p-2">Recent Comments</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to={"/dashboard?tab=comments"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Comment</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
            </Table.Head>
            {comments &&
              comments.map((comment) => (
                <Table.Body key={comment._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="w-full line-clamp-3">
                      {comment.content}
                    </Table.Cell>
                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>

        {/* MANEJO DE POSTS */}
        <div className="flex bg-white flex-col shadow-md rounded-lg dark:bg-gray-800 w-full ">
          <div className="flex items-center justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Posts</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to={"/dashboard?tab=posts"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell className="text-center">
                Post Title
              </Table.HeadCell>
              <Table.HeadCell className="text-center">
                Description
              </Table.HeadCell>
            </Table.Head>
            {posts &&
              posts.map((post) => (
                <Table.Body
                  key={post._id}
                  className="divide-y cursor-pointer"
                  onClick={() => navigate(`/post/${post.slug}`)}
                >
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <div className="w-32 h-20 bg-transparent">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="object-cover w-full h-full rounded-lg"
                        />
                      </div>
                    </Table.Cell>
                    <Table.Cell className="w-64 text-center">
                      {post.title}
                    </Table.Cell>
                    <Table.Cell className="line-clamp-2">
                      {post.content}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
      </div>
    </div>
  );
};
