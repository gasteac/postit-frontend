import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchBar } from "../components/SearchBar";
import { SearchResults } from "../components/SearchResults";
import axios from "axios";
axios.defaults.withCredentials = true;
import { Button } from "flowbite-react";
import { ScrollToTop } from "../components/ScrollToTop";

export const Search = () => {
  const [showMore, setShowMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchedPosts, setSearchedPosts] = useState([]);

  // definimos los parámetros de búsqueda predeterminados
  const [searchData, setSearchData] = useState({
    searchTerm: "",
    order: "asc",
    category: "unselected",
  });
  // obtenemos la ubicación actual y la navegación
  // useLocation nos permite acceder a la ubicación actual y obtener los valores de los parámetros de búsqueda
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // Obtenemos valores específicos de los parámetros de búsqueda
    const searchTerm = searchParams.get("searchTerm") || ""; // Evitar `null`
    const order = searchParams.get("order") || "asc"; // Valor predeterminado seguro
    const category = searchParams.get("category") || "unselected"; // Valor predeterminado seguro

    // Actualizamos el estado solo si es necesario
    if (
      searchData.searchTerm !== searchTerm ||
      searchData.order !== order ||
      searchData.category !== category
    ) {
      setSearchData({ searchTerm, order, category }); // <== Condición para evitar re-renderizado excesivo
    }

    try {
      const getPosts = async () => {
        setIsLoading(true);
        // obtenemos la consulta desde searchParams
        const searchQuery = searchParams.toString();
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/post/getposts?${searchQuery}&limit=6`, { withCredentials: true });

        if (res.status !== 200) {
          setIsLoading(false);
          return;
        }
        if (res.status === 200) {
          setIsLoading(false);
          setSearchedPosts(res.data.posts);
          if (res.data.posts.length === 6) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
        }
      };
      getPosts();
    } catch (error) {
      setIsLoading(false);
    }
  }, [searchParams]);

  const handleShowMore = async () => {
    const numberOfPosts = searchedPosts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/post/getposts?${searchQuery}&limit=6`, { withCredentials: true });
    if (res.status !== 200) {
      return;
    }
    if (res.status === 200) {
      const { data } = res;
      setSearchedPosts([...searchedPosts, ...data.posts]);
      console.log(data.posts);
      if (data.posts.length < 4) {
        setShowMore(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //creamos nuevos parametros de busqueda con los valores actuales de la url
    const newParams = new URLSearchParams();
    if (searchData.searchTerm) {
      newParams.set("searchTerm", searchData.searchTerm);
    }

    if (searchData.order) {
      newParams.set("order", searchData.order);
    }

    if (searchData.category && searchData.category !== "unselected") {
      newParams.set("category", searchData.category);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen">
      <ScrollToTop />
      <SearchBar
        setSearchData={setSearchData}
        handleSubmit={handleSubmit}
        searchData={searchData}
      />

      <SearchResults isLoading={isLoading} searchedPosts={searchedPosts} />
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
    </div>
  );
};
