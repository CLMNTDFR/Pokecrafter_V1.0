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
  const [success, setSuccess] = useState(false);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate fields
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

    // Validate end date (must be at least 7 days from today)
    const today = new Date();
    const selectedEndDate = new Date(endDate);
    const minimumEndDate = new Date(today);
    minimumEndDate.setDate(minimumEndDate.getDate() + 7);

    if (selectedEndDate < minimumEndDate) {
      setError("End date must be at least 7 days from today.");
      return;
    }

    // Create contest object to send
    const newContest = {
      name,
      startDate: today.toISOString(),
      endDate: selectedEndDate.toISOString(),
      description,
      artworks: [],
      createdBy: userData._id,
      creatorRole: "user",
      isCompleted: false,
    };

    dispatch(addContest(newContest));
    setSuccess(true);
    resetForm();

    // Refresh the page after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 4000);
  };

  // Reset form fields and error messages
  const resetForm = () => {
    setName("");
    setEndDate("");
    setDescription("");
    setError("");
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
            placeholder="Choose a catchy and short title"
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
            placeholder="Describe the challenge in less than 200 characters" // Placeholder for textarea
            className="new-contest-form-textarea"
          />
        </div>

        {error && <p className="new-contest-form-error">{error}</p>}
        {success && (
          <p className="new-contest-form-success">Contest created successfully!</p> // Success message
        )}

        <button type="submit" className="new-contest-form-submit-button">
          Submit Contest
        </button>
      </form>
    </div>
  );
};

export default NewContestForm;
