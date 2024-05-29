import { PostCard } from "./PostCard";
import { Spinner } from "flowbite-react";
export const SearchResults = ({isLoading, searchedPosts}) => {

  if (isLoading) {
    return (
      <div className="flex items-start z-10 justify-center mt-12 min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <>
      <div className="mt-5 flex flex-wrap items-center justify-center">
        {searchedPosts.length !== 0 && !isLoading ? (
          <>
            {searchedPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </>
        ) : (
          <h1 className="text-3xl mt-5">No posts found :(</h1>
        )}
      </div>

    </>
  );
};
