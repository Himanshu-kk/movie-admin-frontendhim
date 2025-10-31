import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Pencil, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";

const AdminMoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [moviesPerPage, setMoviesPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  // ✅ Detect screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setMoviesPerPage(12);
      else setMoviesPerPage(20);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Fetch all movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/movies`);
        setMovies(res.data.movies || []);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch movies");
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // ✅ Pagination logic
  const indexOfLastMovie = page * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(movies.length / moviesPerPage);

  // ✅ Delete movie
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/movies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMovies((prev) => prev.filter((m) => m._id !== id));
      alert("Movie deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete movie");
    }
  };

  // ✅ Search filter (by title or category)
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const filtered = movies.filter(
      (m) =>
        m.title?.toLowerCase().includes(query) ||
        m.category?.toLowerCase().includes(query) ||
        m.genres?.some((g) => g.toLowerCase().includes(query))
    );
    setSearchResults(filtered);
  };

  // ✅ Render card
  const renderMovieCard = (movie) => (
    <div
      key={movie._id}
      className="bg-white rounded-xl shadow-md border hover:shadow-lg transition p-3 flex flex-col"
    >
      <img
        src={
          movie.mainPoster
            ? movie.mainPoster
            : movie.imgSample?.[0] || "/placeholder.png"
        }
        alt={movie.title}
        className="h-48 w-full object-cover rounded-lg"
      />
      <div className="flex-1 mt-2">
        <h3 className="font-semibold text-sm text-gray-800">{movie.title}</h3>
        <p className="text-xs text-gray-500">
          ⭐ {movie.imdbRating || "N/A"} | 🎭 {movie.category || "Unknown"}
        </p>
      </div>

      <div className="flex justify-between items-center mt-3">
        <button
          onClick={() => navigate(`/admin/edit/${movie._id}`)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-xs flex items-center gap-1"
        >
          <Pencil size={14} /> Edit
        </button>
        <button
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs flex items-center gap-1"
          onClick={() => handleDelete(movie._id)}
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">
        🎥 All Movies ({movies.length})
      </h2>

      {/* ✅ Search Bar */}
      <div className="max-w-md mx-auto mb-8 flex items-center bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
        <Search className="ml-3 text-gray-500" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by name, category or genre..."
          className="flex-1 px-3 py-2 outline-none text-gray-700"
        />
      </div>

      {/* ✅ Search Results Section */}
      {searchResults.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3 text-gray-800 text-center">
            🔍 Search Results ({searchResults.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {searchResults.map(renderMovieCard)}
          </div>
          <div className="border-t-2 border-dashed border-gray-300 my-10"></div>
        </div>
      )}

      {/* ✅ Main Movie Grid */}
      {loading ? (
        <div className="text-center text-lg text-gray-600">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {currentMovies.map(renderMovieCard)}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  page === i + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminMoviesList;
