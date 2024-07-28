import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useGetFileFolders = () => {
  const [fileFolders, setFileFolders] = useState([]);
  const { token } = useSelector((e) => e.auth);

  const getFileFolders = async (parentId = null) => {
    try {
      const res = await fetch(`${process.env.BACKEND_URL}/api/v1/file-folder`, {
        method: "POST",
        body: JSON.stringify({parentId}),
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setFileFolders(data.data.fileFolders);
    } catch (error) {
      alert(error.message);
    }
  };
  
  return { getFileFolders, fileFolders };
};
export default useGetFileFolders;