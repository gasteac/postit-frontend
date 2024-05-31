import { useEffect, useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
export const Comment = ({ comment, onLike, handleDeleteComment }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState({});
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/${comment.userId}`, { withCredentials: true });
        if (res.status !== 200) {
          return;
        }

        setUser(res.data);
      } catch (error) {
        setUser({
          username: "Deleted-User",
          profilePic: "https://cdn-icons-png.flaticon.com/512/6543/6543638.png",
        });
      }
    };
    getUser();
  }, [comment]);

  return (
    <div className="flex p-2 text-sm">
      <div className="flex-shrink-0 mr-3 justify-center ">
        <img
          className="w-10 h-10 object-cover rounded-full bg-gray-200"
          src={user?.profilePic}
          alt={user?.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1 gap-2">
          <span className="truncate">{user.username}</span>
          <span className="text-gray-600 dark:text-gray-400 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
          {currentUser && currentUser._id === comment.userId && (
            <span
            
              onClick={() => handleDeleteComment(comment._id, comment.content)}
              className="text-red-500 text-xs cursor-pointer hover:filter hover:brightness-150"
            >
              delete
            </span>
          )
          }
        </div>
        <p className="pb-2">{comment?.content}</p>
        <div className="flex items-start gap-1 h-2  mb-3">
          <button
            type="button"
            onClick={() => onLike(comment._id)}
            className={`text-gray-400 hover:text-blue-500 ${currentUser && comment.likes.includes(currentUser._id)
              ? "!text-blue-500"
              : "text-gray-500"
              }`}
          >
            <FaThumbsUp />
          </button>
          <p className="text-gray-400 text-xs">
            {comment.numberOfLikes > 0 &&
              comment.numberOfLikes +
              " " +
              (comment.numberOfLikes === 1 ? "like" : "likes")}
          </p>
        </div>
      </div>
    </div>
  );
};
