import axios from 'axios'
import { Pencil } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BASE_URL } from '../config'


const AdminDashbord = () => {
  const navigate = useNavigate()
  const [message, setMessage] = useState("WellCome")

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get(`${BASE_URL}/api/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        setMessage(res.data.message);
      } catch (error) {
        console.log("Dashbord Error:", error)
        setMessage("Failed to fetch dashboard data")
      }
    };
    fetchDashboard();
  }, []);
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white transition-all'>
      <h1 className='text-3xl font-bold mb-4'>Admin Dashboard</h1>
      <p>{message}</p>

      <button className='mt-4 bg-red-400 px-4 py-2 rounded hover:bg-red-700 '
      onClick={() => {
        localStorage.removeItem("token");
        window.location.href = "/admin/login";
      }}
      >Logout</button>
      <button 
  className='text-xl bg-blue-500 text-white mt-4 px-6 py-2 rounded hover:bg-blue-700 transition-all'
  onClick={() => navigate("/admin/add-movie")}
>
  ➕ Add New Movie
</button>
<button
          onClick={() => navigate("/admin/movies")}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md m-4"
        >
          🎞️ Show All Movies
        </button>

        <Link to="/movies" className="text-blue-500 bg-wheat-200 hover:bg-wheat-300 px-4 py-2 rounded-lg ">
          🎬 View All Movies
        </Link>

       
    </div>
  )
}

export default AdminDashbord
