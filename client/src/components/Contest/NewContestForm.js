import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addContest } from "../../actions/contest.actions";

const NewContestForm = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userReducer);
  const [name, setName] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); // État pour le message de succès

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation des champs
    if (name.length > 30) {
      setError("Contest name must be less than 30 characters.");
      return;
    }
    if (description.length > 200) {
      setError("Description must be less than 200 characters.");
      return;
    }
    if (!endDate) {
      setError("Please select an end date.");
      return;
    }

    // Validation de la date de fin (doit être au moins 7 jours après la date de création)
    const today = new Date();
    const selectedEndDate = new Date(endDate);
    const minimumEndDate = new Date(today);
    minimumEndDate.setDate(minimumEndDate.getDate() + 7); // Ajoute 7 jours

    if (selectedEndDate < minimumEndDate) {
      setError("End date must be at least 7 days from today.");
      return;
    }

    // Créer l'objet du concours à envoyer
    const newContest = {
      name,
      startDate: today.toISOString(),
      endDate: selectedEndDate.toISOString(),
      description,
      artworks: [],
      createdBy: userData._id, // ID utilisateur
      creatorRole: "user", // Défaut: "user"
      isCompleted: false,
    };

    dispatch(addContest(newContest));
    setSuccess(true); // Afficher le message de succès
    setName("");
    setEndDate("");
    setDescription("");
    setError("");

    // Rafraîchir la page après un court délai
    setTimeout(() => {
      window.location.reload(); // Rafraîchit la page
    }, 4000); // Délai de 4 secondes pour permettre à l'utilisateur de voir le message de succès
  };

  return (
    <div className="new-contest-form-container">
      <form onSubmit={handleSubmit} className="new-contest-form">
        <div className="new-contest-form-field">
          <label htmlFor="contestName">Contest Name:</label>
          <input
            type="text"
            id="contestName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={30}
            required
            placeholder="Choose a catchy and short title" // Placeholder ajouté
            className="new-contest-form-input"
          />
        </div>

        <div className="new-contest-form-field">
          <label htmlFor="endDate">End Date (at least in 7 days):</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="new-contest-form-input"
          />
        </div>

        <div className="new-contest-form-field">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={200}
            required
            placeholder="Describe the challenge in less than 200 characters" // Placeholder ajouté
            className="new-contest-form-textarea"
          />
        </div>

        {error && <p className="new-contest-form-error">{error}</p>}
        {success && <p className="new-contest-form-success">Contest created successfully!</p>} {/* Message de succès */}

        <button type="submit" className="new-contest-form-submit-button">
          Submit Contest
        </button>
      </form>
    </div>
  );
};

export default NewContestForm;
