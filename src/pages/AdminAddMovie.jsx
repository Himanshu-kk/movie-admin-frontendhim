import React, { useState } from "react";
import axios from "axios";
import { Plus, Trash2 } from "lucide-react";
import { BASE_URL } from "../config";

const genresList = [
  "Action", "Comedy", "Drama", "Thriller", "Horror",
  "Romance", "Sci-Fi", "Fantasy", "Adventure", "Crime",
];

const categoriesList = [
  "Bollywood", "Hollywood", "South", "Web Series",
  "Anime", "Documentary", "K-Drama",
];

const AdminAddMovie = () => {
  const [movie, setMovie] = useState({
    title: "",
    description: "",
    imdbRating: "",
    actors: "",
    director: "",
    language: "",
    quality: "",
    genres: [],
    categories: [],
    downloadLinks: [""],
  });

  const [mainPoster, setMainPoster] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🟢 text input
  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  // 🟢 checkbox (genres/categories)
  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    setMovie((prev) => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter((item) => item !== value),
    }));
  };

  // 🟢 main poster upload
  const handleMainPoster = (e) => {
    setMainPoster(e.target.files[0]);
  };

  // 🟢 multiple gallery image upload
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setGallery(files);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  // 🟢 add/remove download link
  const handleDownloadLinkChange = (index, value) => {
    const updated = [...movie.downloadLinks];
    updated[index] = value;
    setMovie({ ...movie, downloadLinks: updated });
  };

  const addDownloadLink = () => {
    setMovie((prev) => ({ ...prev, downloadLinks: [...prev.downloadLinks, ""] }));
  };

  const removeDownloadLink = (index) => {
    setMovie((prev) => ({
      ...prev,
      downloadLinks: prev.downloadLinks.filter((_, i) => i !== index),
    }));
  };

 // 🟢 form submit
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!movie.title.trim()) return alert("Please enter movie title");

  const formData = new FormData();
  for (const key in movie) {
    if (Array.isArray(movie[key])) {
      formData.append(key, movie[key].join(","));
    } else formData.append(key, movie[key]);
  }

  // ✅ Corrected: must match backend field names
  if (mainPoster) formData.append("mainPoster", mainPoster);
  gallery.forEach((img) => formData.append("imgSample", img));

  try {
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await axios.post(`${BASE_URL}/api/movies`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    alert("✅ Movie added successfully!");
    console.log(res.data);

    setMovie({
      title: "",
      description: "",
      imdbRating: "",
      actors: "",
      director: "",
      language: "",
      quality: "",
      genres: [],
      categories: [],
      downloadLinks: [""],
    });
    setMainPoster(null);
    setGallery([]);
    setPreviews([]);
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Upload failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-white text-gray-900 py-10 px-4">
      <h2 className="text-4xl font-bold text-center mb-10 text-indigo-700">
        🎬 Add New Movie
      </h2>

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white border border-gray-200 shadow-md rounded-2xl p-8 space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block font-semibold mb-1">Title *</label>
          <input
            name="title"
            value={movie.title}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter movie title"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            name="description"
            value={movie.description}
            onChange={handleChange}
            rows="3"
            placeholder="Short movie description..."
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* IMDB Rating */}
        <div>
          <label className="block font-semibold mb-1">IMDB Rating</label>
          <input
            type="number"
            name="imdbRating"
            value={movie.imdbRating}
            onChange={handleChange}
            min="0"
            max="10"
            step="0.1"
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="0-10"
          />
        </div>

        {/* Director, Language, Quality, Actors */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Director</label>
            <input
              name="director"
              value={movie.director}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Language</label>
            <input
              name="language"
              value={movie.language}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Quality</label>
            <input
              name="quality"
              value={movie.quality}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Actors</label>
            <input
              name="actors"
              value={movie.actors}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Comma separated actors"
            />
          </div>
        </div>

        {/* Genres */}
        <div>
          <h3 className="font-semibold mb-2">Select Genres</h3>
          <div className="grid sm:grid-cols-3 gap-2">
            {genresList.map((genre) => (
              <label
                key={genre}
                className="flex items-center gap-2 border p-2 rounded-md hover:bg-indigo-50"
              >
                <input
                  type="checkbox"
                  value={genre}
                  checked={movie.genres.includes(genre)}
                  onChange={(e) => handleCheckboxChange(e, "genres")}
                />
                {genre}
              </label>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-semibold mb-2">Select Categories</h3>
          <div className="grid sm:grid-cols-3 gap-2">
            {categoriesList.map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-2 border p-2 rounded-md hover:bg-indigo-50"
              >
                <input
                  type="checkbox"
                  value={cat}
                  checked={movie.categories.includes(cat)}
                  onChange={(e) => handleCheckboxChange(e, "categories")}
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        {/* Main Poster */}
        <div>
          <label className="block font-semibold mb-2">Main Poster Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleMainPoster}
            className="w-full border p-2 rounded-lg"
          />
        </div>

        {/* Gallery Upload */}
        <div>
          <label className="block font-semibold mb-2">Gallery Images (4–5)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleGalleryChange}
            className="w-full border p-2 rounded-lg"
          />
        </div>

        {/* Gallery Previews */}
        {previews.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
            {previews.map((src, i) => (
              <div key={i} className="relative">
                <img
                  src={src}
                  alt=""
                  className="rounded-lg border object-cover w-full h-40"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreviews((p) => p.filter((_, idx) => idx !== i));
                    setGallery((p) => p.filter((_, idx) => idx !== i));
                  }}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Multiple Download Links */}
        <div>
          <label className="block font-semibold mb-2">Download Links</label>
          {movie.downloadLinks.map((link, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder={`Download link ${index + 1}`}
                value={link}
                onChange={(e) =>
                  handleDownloadLinkChange(index, e.target.value)
                }
                className="w-full border p-2 rounded-lg"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeDownloadLink(index)}
                  className="bg-red-500 text-white rounded-lg px-3"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addDownloadLink}
            className="mt-2 flex items-center gap-1 text-indigo-600 font-semibold"
          >
            <Plus size={18} /> Add another link
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold mt-6 shadow-md transition-all"
        >
          {loading ? "Uploading..." : "Add Movie"}
        </button>
      </form>
    </div>
  );
};

export default AdminAddMovie;


