import { useState } from "react"
import { useSelector } from "react-redux";

const useUploadFile = () => {
    const { token } = useSelector((e) => e.auth);
    const [isUploadAllowed, setIsUpladAllowed] = useState(true)
    const uploadFile = async ({ file, parentId }) => {
        try {
            setIsUpladAllowed(false);
            let formData = new FormData();
            formData.append("file", file);
            formData.append("parentId", parentId);

            const res = await fetch(`${process.env.BACKEND_URL}/api/v1/file`, {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        }

        catch (error) {
            alert(error)
        }

        finally {
            setIsUpladAllowed(true)
        }

    };
    return { uploadFile, isUploadAllowed };
}

export default useUploadFile;