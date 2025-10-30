import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";

const AllMovies = () => {
  const [movies, setMovies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Home");
  const [search, setSearch] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null); // 👈 for details view

  const categories = [
    "Home",
    "Bollywood",
    "Hollywood",
    "South",
    "Web Series",
    "Anime",
    "Documentary",
    "K-Drama",
  ];

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/movies`);
        setMovies(res.data.movies || []);
        setFiltered(res.data.movies || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load movies");
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // ✅ Filter logic for search and category
  useEffect(() => {
    let temp = [...movies];

    if (selectedCategory !== "Home") {
      temp = temp.filter(
        (m) =>
          m.category?.toLowerCase() === selectedCategory.toLowerCase() ||
          m.genre?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (search.trim() !== "") {
      temp = temp.filter((m) =>
        m.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(temp);
  }, [search, selectedCategory, movies]);

  return (
    <div className="min-h-screen bg-[#111] text-white">
      {/* 🔶 Top Navigation Bar */}
      <div className="bg-black flex flex-wrap items-center justify-between px-4 sm:px-10 py-3 border-b border-gray-700 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-yellow-400 text-black px-3 py-1 rounded font-bold">
            4KHDHub
          </div>
          <span className="hidden sm:inline text-gray-300 font-medium">
            Home 🏠
          </span>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 text-sm text-gray-300 mt-2 sm:mt-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedMovie(null);
              }}
              className={`px-2 py-1 rounded-md transition-all ${
                selectedCategory === cat
                  ? "bg-yellow-400 text-black font-semibold"
                  : "hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search box */}
        <div className="mt-3 sm:mt-0">
          <input
            type="text"
            placeholder="Search here..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1 rounded-md border border-gray-600 bg-gray-900 text-white focus:outline-none focus:border-yellow-400"
          />
        </div>
      </div>

      {/* 🔥 Section Title */}
      <div className="px-5 sm:px-10 py-4 border-b border-gray-800 flex items-center gap-2">
        <span className="text-lg font-semibold">
          {selectedMovie ? "🎬 Movie Details" : "🔥 Latest Releases"}
        </span>
        {selectedMovie && (
          <button
            onClick={() => setSelectedMovie(null)}
            className="text-yellow-400 text-sm ml-3 hover:underline"
          >
            ← Back to List
          </button>
        )}
      </div>

      {/* 🔹 Conditional Rendering */}
      {loading ? (
        <div className="text-center text-lg text-gray-400 py-10">
          Loading movies...
        </div>
      ) : selectedMovie ? (
        // 🔸 Movie Details Section (inline)
        <div className="px-4 sm:px-10 py-6 flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <img
              src={
                selectedMovie.mainPoster ||
                selectedMovie.imgSample?.[0] ||
                "/placeholder.png"
              }
              alt={selectedMovie.title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          <div className="md:w-2/3 space-y-3">
            <h1 className="text-2xl font-bold">{selectedMovie.title}</h1>
            <p className="text-gray-400">
              ⭐ {selectedMovie.imdbRating || "N/A"} |{" "}
              {selectedMovie.language || "Unknown"}
            </p>

            <div className="flex flex-wrap gap-2 text-sm">
              {selectedMovie.categories?.map((c) => (
                <span
                  key={c}
                  className="bg-gray-800 px-2 py-1 rounded-md text-gray-300"
                >
                  {c}
                </span>
              ))}
              {selectedMovie.genres?.map((g) => (
                <span
                  key={g}
                  className="bg-yellow-400 text-black px-2 py-1 rounded-md font-semibold"
                >
                  {g}
                </span>
              ))}
            </div>

            <p className="text-gray-300 mt-4 leading-relaxed">
              {selectedMovie.description || "No description available."}
            </p>

            {selectedMovie.imgSample?.length > 0 && (
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {selectedMovie.imgSample.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Sample ${i + 1}`}
                    className="rounded-lg w-full h-32 object-cover hover:scale-105 transition-transform"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-gray-400 py-10">No movies found.</div>
      ) : (
        // 🔸 Movie Grid Section
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4 sm:px-10 py-6">
          {filtered.map((movie) => (
            <div
              key={movie._id}
              onClick={() => setSelectedMovie(movie)}
              className="bg-gray-900 rounded-lg overflow-hidden shadow hover:shadow-lg hover:scale-105 transition-transform cursor-pointer"
            >
              <img
                src={
                  movie.mainPoster
                    ? movie.mainPoster
                    : movie.imgSample?.[0] || "/placeholder.png"
                }
                alt={movie.title}
                className="w-full h-52 object-cover"
              />
              <div className="p-2 text-center">
                <h3 className="text-sm font-semibold truncate">
                  {movie.title}
                </h3>
                <p className="text-xs text-gray-400">
                  ⭐ {movie.imdbRating || "N/A"} |{" "}
                  {movie.category || movie.genre || "Unknown"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllMovies;
