import {useNavigate} from "react-router-dom"

const useSignup = () => {
    const navigate = useNavigate()
    
    const signup = async ({ email, name, password }) => {

        try {
            const res = await fetch(`${process.env.BACKEND_URL}/api/v1/auth/signup`, {
                method: "POST",
                body: JSON.stringify({ email, name, password }),
                headers: {
                    "content-type": "application/json",
                },
            });

            const data = await res.json();
            if(data.status === "success") {
                navigate(`/login?email=${email}`)
            }
            else {
                alert(data.message);
            }

        } catch (error) {
            alert("Signup error : " + error.message)
        }


    };

    return { signup };
}

export default useSignup