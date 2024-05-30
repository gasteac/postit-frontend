import { Button } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";

export const PostCard = ({ post }) => {
  return (
    <div className="group relative lg:hover:scale-105  transition-all ease-in-out duration-150 rounded-3xl m-5 overflow-hidden shadow-lg">
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt={post.title}
          className="w-screen rounded-xl h-52 lg:w-96 lg:h-96 object-cover transition-all ease-in-out duration-150"
        />

        <p
          style={{ textShadow: "0px 0px 3px rgba(0, 0, 0, 1)" }}
          className="line-clamp-1 font-bold text-white text-xl absolute bottom-10 p-4"
        >
          {post.title}
        </p>

        <p
          style={{ textShadow: "0px 0px 3px rgba(0, 0, 0, 1)" }}
          className=" text-white absolute line-clamp-1 font-semibold bottom-2 p-4 h-16"
        >
          {post.content}
        </p>

        {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-90 rounded-3xl lg:group-hover:bg-black lg:group-hover:bg-opacity-40 " /> */}
        {/* <Button
          pill
          color={"gray"}
          className="absolute dark:bg-gray-600 shadow-2xl shadow-gray-700 top-[40%] lg:top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]   lg:group-hover:scale-[1.2] border-none lg:scale-0 lg:group-hover:left-[50%] lg:transition-all lg:ease-out lg:duration-300 "
        >
          See more
        </Button> */}
      </Link>
    </div>
  );
};
