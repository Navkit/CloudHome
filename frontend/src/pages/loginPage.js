import React, { useState } from 'react';
import useLogin from '../hooks/useLogin';
import { Link } from 'react-router-dom';
import "../styles/loginPage.css";


const LoginPage = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");
  const { login } = useLogin();

  const handleSubmit = () => {
    const validation = true;

    if (validation) {
      login({ email, password });
    }
    else {
      alert("Validation failed");
    }
  }

  return (
    <div className='login-page-main-container'>

    <div className='login-page-container'>
    <h3 >Login</h3>
      <input type='text' className='login-page-container-email'  placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type='password' className='login-page-container-password' placeholder='Enter Password' value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSubmit} className='login-page-container-login-button'>Login</button>
      <p style={{fontSize: "20px"}}>Do not have an account? <Link to="/signup" className='link'>Sign Up</Link></p>
    </div>
    </div>
  )
}

export default LoginPage