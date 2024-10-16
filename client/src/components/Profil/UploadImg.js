import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadPicture } from "../../actions/user.actions";

const UploadImg = () => {
  const [file, setFile] = useState(null);
  const [displayFileName, setDisplayFileName] = useState("Change profile picture"); // Texte par défaut
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setDisplayFileName(selectedFile.name); // Mettre à jour le nom du fichier à afficher
    }
  };

  // Fonction pour déclencher le clic sur l'input file
  const handleClick = () => {
    document.getElementById("file").click(); // Clic sur l'input caché
  };

  return (
    <form 
      onSubmit={handlePicture} 
      className="upload-pic" 
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }} // Centrage
    >
      <br />
      <input
        type="file"
        id="file"
        name="file"
        accept=".jpg, .jpeg, .png"
        onChange={handleFileChange}
        style={{ display: "none" }} // Masquer l'input par défaut
      />
      <button className="custom-upload-button" onClick={handleClick}>
        <img
          src="/img/icons/pokecrafter-add3.svg"
          alt="Add Icon"
          className="add-icon" // Ajouter une classe CSS pour l'icône
        />
        {displayFileName} {/* Affiche le nom du fichier ou le texte par défaut */}
      </button>
      <input type="submit" value="Submit" className="submit-button" style={{ transform: "translateY(-40px)" }}/>
    </form>
  );
};

export default UploadImg;
