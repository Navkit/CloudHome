import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useGetFileFolders = () => {
    const { token } = useSelector((e) => e.auth);
    const [fileFolders, setFileFolders] = useState([]);

    const getFileFolders = async (parentId = null) => {
        try {
            const res = await fetch(`https://cloudhome-8fkj.onrender.com/api/v1/file-folder`, {
                method: "POST",
                body: JSON.stringify({ parentId }),
                headers: {
                    "content-type": "application/json",
                    authorization: "Bearer " + token,
                },
            });
            const data = await res.json();
            setFileFolders(data.data.fileFolders);
        } catch (err) {
            alert(err.message);
        }
    };

    return { getFileFolders, fileFolders };
};

export default useGetFileFolders;
