import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../config";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/movies/${id}`);
        setMovie(res.data.movie);
      } catch (err) {
        console.error(err);
        alert("Movie not found");
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  if (loading) {
    return <div className="text-center text-gray-400 py-10">Loading...</div>;
  }

  if (!movie) {
    return (
      <div className="text-center text-gray-400 py-10">
        Movie not found.
        <button
          className="block mx-auto mt-3 px-4 py-2 bg-yellow-400 text-black rounded-md"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-white px-5 sm:px-10 py-6">
      <button
        onClick={() => navigate(-1)}
        className="text-yellow-400 mb-4 underline hover:text-yellow-300"
      >
        ← Back
      </button>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Poster */}
        <div className="md:w-1/3">
          <img
            src={movie.mainPoster || movie.imgSample?.[0] || "/placeholder.png"}
            alt={movie.title}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Info */}
        <div className="md:w-2/3 space-y-3">
          <h1 className="text-2xl font-bold">{movie.title}</h1>
          <p className="text-gray-400">
            ⭐ {movie.imdbRating || "N/A"} | {movie.language || "Unknown"}
          </p>

          <div className="flex flex-wrap gap-2 text-sm">
            {movie.categories?.map((c) => (
              <span
                key={c}
                className="bg-gray-800 px-2 py-1 rounded-md text-gray-300"
              >
                {c}
              </span>
            ))}
            {movie.genres?.map((g) => (
              <span
                key={g}
                className="bg-yellow-400 text-black px-2 py-1 rounded-md font-semibold"
              >
                {g}
              </span>
            ))}
          </div>

          <p className="text-gray-300 mt-4 leading-relaxed">
            {movie.description || "No description available."}
          </p>

          {/* Sample Images */}
          {movie.imgSample && movie.imgSample.length > 0 && (
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {movie.imgSample.map((img, i) => (
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
    </div>
  );
};

export default MovieDetails;
