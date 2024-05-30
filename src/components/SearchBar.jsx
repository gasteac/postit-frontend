import { Button, Select, TextInput } from "flowbite-react";
import { useMemo } from "react";

export const SearchBar = ({ handleSubmit, searchData, setSearchData }) => {
  const searchOptions = useMemo(() => {
    return {
      searchTerm: searchData.searchTerm || "", // Asegurarse de no tener `null`
      order: searchData.order || "desc", // Valor predeterminado seguro
      category: searchData.category || "unselected", // Valor predeterminado seguro
    };
  }, [searchData.searchTerm, searchData.order, searchData.category]);
  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === "searchTerm") {
      setSearchData({ ...searchData, searchTerm: value });
    }

    if (id === "order") {
      setSearchData({ ...searchData, order: value });
    }

    if (id === "category") {
      setSearchData({ ...searchData, category: value });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="z-20 w-screen flex-col gap-4 h-full p-4 md:flex-row  flex items-center justify-evenly"
    >
      <input
        type="text"
        className="input input-bordered w-full md:flex-1 "
        id="searchTerm"
        placeholder="Search.."
        value={searchOptions.searchTerm}
        onChange={handleChange}
      />
      <select
        className="select select-bordered w-full flex-1"
        id="order"
        value={searchOptions.order}
        onChange={handleChange}
      >
        <option value="desc">Latest</option>
        <option value="asc">Oldest</option>
      </select>

      <select
        className="select select-bordered w-full flex-1"
        id="category"
        value={searchOptions.category}
        onChange={handleChange}
      >
        <option value="unselected">Select Category</option>
        <option value="tech-gadgets">Technology & Gadgets</option>
        <option value="animals-nature">Animals and Nature</option>
        <option value="travel-adventure">Travel & Adventure</option>
        <option value="cooking-recipes">Cooking & Recipes</option>
        <option value="books-literature">Books & Literature</option>
        <option value="health-wellness">Health & Wellness</option>
        <option value="movies-tv">Movies & TV</option>
        <option value="fashion-style">Fashion & Style</option>
        <option value="art-design">Art & Design</option>
        <option value="music-concerts">Music & Concerts</option>
        <option value="history-culture">History & Culture</option>
        <option value="photography-videography">
          Photography & Videography
        </option>
        <option value="science-discoveries">Science & Discoveries</option>
        <option value="education-learning">Education & Learning</option>
        <option value="environment-ecology">Environment & Ecology</option>
        <option value="entrepreneurship-business">
          Entrepreneurship & Business
        </option>
        <option value="sports-fitness">Sports & Fitness</option>
        <option value="automobiles-vehicles">Automobiles & Vehicles</option>
        <option value="relationships-family">Relationships & Family</option>
        <option value="games-videogames">Games & Videogames</option>
        <option value="news-current-events">News & Current Events</option>
        <option value="other">Other...</option>
      </select>
      <button type="submit" className="btn w-full md:flex-1">Search</button>
    </form>
  );
};
