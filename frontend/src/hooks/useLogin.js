import { useDispatch } from "react-redux";
import {useNavigate} from "react-router-dom";
import { appLogin } from "../store/slices/authSlice";

const useLogin = () => {

    // const navigate = useNavigate();
    const dispatch = useDispatch();

    const login = async ({ email, password }) => {

        try {
            const res = await fetch(`${process.env.BACKEND_URL}/api/v1/auth/login`, {
                method: "POST",
                body: JSON.stringify({ email, password }),
                headers: {
                    "content-type": "application/json",
                },
            });

            const data = await res.json();
            if(data.status === "Success") {
                // navigate("/")
                dispatch(appLogin(data))
            }
            else {
                alert(data.message);
            }

        } catch (error) {
            alert("Login error : " + error.message)
        }
    };

    return { login };
}

export default useLogin