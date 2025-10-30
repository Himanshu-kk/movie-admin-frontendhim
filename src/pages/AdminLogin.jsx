import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';
const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);  // 1 = email step, 2 = OTP step
  
  const navigate = useNavigate()
  // Step 1: Handle sending OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/admin/send-otp`, {
        email,
      });

      alert(res.data.message);
      setStep(2); // Move to OTP step
      
    } catch (error) {
    
      console.error("Send OTP Error:", error);
      alert(error.response.data.message || "Failed to send OTP")    
    }
  };

  // Step 2: Handle verifying OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/admin/verify-otp`, {
  email,
  otp,
});

      alert(res.data.message);

      // Save token in LocalStorage
      localStorage.setItem("token", res.data.token);

      // Redirect to admin dashboard
      navigate("/admin-dashboard")
    } catch (error) {
      console.error("Verify OTP Error:", error);
      alert(error.response?.data?.message || "Invalid OTP")
    }
  }


  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-900'>
      <div className='bg-white p-6 rounded shadow-xl w-80'>
        <h2 className='text-2xl font-bold text-center mb-4 text-gray-800'>
          Admin Login
        </h2>
        
        {step === 1 ? (
          <form onSubmit={handleSendOTP}>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder='Enter email...'
              className='w-full p-2 border rounded mb-3'
            />
            
            <button type='submit' 
            className='bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-700 transition-all duration-300'>Send OTP</button>
             </form>) 
             : 
             (<form onSubmit={handleVerifyOTP}>
              <input type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className='w-full p-2 border rounded mb-3'
              />
              <button type='submit'
               className='bg-green-600 text-white w-full py-2 rounded hover:bg-green-700 transition-all duration-300'>
                Verify OTP</button>
             </form>
        )}
      </div>
    </div>
  )
}

export default AdminLogin
