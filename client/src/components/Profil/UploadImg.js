import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadPicture } from "../../actions/user.actions";

const UploadImg = () => {
  const [file, setFile] = useState(null);
  const [displayFileName, setDisplayFileName] = useState("Change profile picture");
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userReducer);

  // Handles the picture upload
  const handlePicture = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", userData.username);
    data.append("userId", userData._id);
    data.append("file", file);

    dispatch(uploadPicture(data, userData._id));
  };

  // Updates the file state and display filename when a new file is selected
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setDisplayFileName(selectedFile.name);
    }
  };

  // Trigger click on hidden file input
  const handleClick = () => {
    document.getElementById("file").click();
  };

  return (
    <form 
      onSubmit={handlePicture} 
      className="upload-pic" 
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <br />
      <input
        type="file"
        id="file"
        name="file"
        accept=".jpg, .jpeg, .png"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <button className="custom-upload-button" onClick={handleClick}>
        <img
          src="/img/icons/pokecrafter-add3.svg"
          alt="Add Icon"
          className="add-icon"
        />
        {displayFileName}
      </button>
      <input type="submit" value="Submit" className="submit-button" style={{ transform: "translateY(-40px)" }} />
    </form>
  );
};

export default UploadImg;
