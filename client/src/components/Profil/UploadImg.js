import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadPicture } from "../../actions/user.actions";

const UploadImg = () => {
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userReducer);

  const handlePicture = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", userData.username);
    data.append("userId", userData._id);
    data.append("file", file);

    dispatch(uploadPicture(data, userData._id));
  };

  return (
    <form action="" onSubmit={handlePicture} className="upload-pic">
      <br />
      <br />
      <input
        type="file"
        id="file"
        name="file"
        accept=".jpg, .jpeg, .png"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <input type="submit" value="Submit" />
    </form>
  );
};

export default UploadImg;
