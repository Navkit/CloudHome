
import React, { useState } from 'react'
import useSignup from '../hooks/useSignup';
import { Link } from 'react-router-dom'

const SignupPage = () => {
    
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const { signup } = useSignup();

    const handleSubmit = () => {
        const validation = true;
        if (validation) {
            signup({ email, name, password });
        }

        else {
            alert("Validation failed");
        }
    }

    return (
        <div className='signup-page-main-container'>
            <div className='signup-page-container'>
                <h3 >Sign Up</h3>
                <input type='email' placeholder='Enter Email' className='signup-page-container-email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type='text' placeholder='Enter Name' className='signup-page-container-name' value={name} onChange={(e) => setName(e.target.value)} />
                <input type='password' placeholder='Enter Password' className='signup-page-container-password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <button onClick={handleSubmit} className='signup-page-container-sign-button'>Sign Up</button>
                <p style={{fontSize: "20px"}}>Already have an account? <Link to="/login" className='link'>Login</Link></p>
            </div>

        </div>

    )
}

export default SignupPage
