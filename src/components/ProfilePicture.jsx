import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfilePicture = () => {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `https://robohash.org/${Math.random()}.png`
      );
      setImageUrl(response.request.responseURL);
    };
    fetchData();
  }, []);

  return <img src={imageUrl} className="rounded-xl border-white" alt="yourCrib ai_gen_image" />;
};

export default ProfilePicture;
