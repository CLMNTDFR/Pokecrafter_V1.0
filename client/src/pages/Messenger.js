import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getConversations,
  getConversationMessages,
  sendMessage,
} from "../actions/conversation.actions";
import LeftNav from "../components/LeftNav";
import { UidContext } from "../components/AppContext";

const Messenger = () => {
  const dispatch = useDispatch();
  const uid = useContext(UidContext); // Utiliser useContext pour obtenir l'UID
  const userData = useSelector((state) => state.userReducer); // Pour l'utilisateur connecté
  const conversations = useSelector(
    (state) => state.conversationReducer?.conversations || []
  );
  const activeMessages = useSelector(
    (state) => state.conversationReducer.activeConversationMessages
  );

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageContent, setMessageContent] = useState("");

  // Log pour vérifier les données de l'utilisateur
  useEffect(() => {
    console.log("userData:", userData);
    console.log("uid:", uid);
  }, [userData, uid]);

  // Récupérer les conversations de l'utilisateur connecté
  useEffect(() => {
    if (userData && userData._id) {
      console.log("Fetching conversations for user:", userData._id);
      dispatch(getConversations(userData._id));
    }
  }, [userData, dispatch]);

  // Log pour vérifier les conversations récupérées
  useEffect(() => {
    console.log("Conversations:", conversations);
  }, [conversations]);

  // Récupérer les messages de la conversation sélectionnée
  const handleSelectConversation = (conversationId) => {
    console.log("Selected conversation ID:", conversationId);
    setSelectedConversation(conversationId);
    dispatch(getConversationMessages(conversationId));
  };

  // Log pour vérifier les messages récupérés pour la conversation active
  useEffect(() => {
    console.log("Active messages:", activeMessages);
  }, [activeMessages]);

  // Envoyer un message dans la conversation active
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageContent.trim() && selectedConversation) {
      console.log(
        "Sending message:",
        messageContent,
        "to conversation:",
        selectedConversation
      );
      dispatch(
        sendMessage(selectedConversation, userData._id, messageContent)
      );
      setMessageContent(""); // Réinitialiser le champ de saisie
    } else {
      console.log("Message content is empty or no conversation selected.");
    }
  };

  return (
    <div className="home">
      <LeftNav />
      <div className="main">
        <div className="header-container">
          <h3 className="title-of-page">Message box</h3>
        </div>
        <hr />

        <div className="messenger-container">
          {/* Vérifier si l'utilisateur est connecté */}
          {uid ? (
            <>
              {/* Dropdown pour sélectionner une conversation */}
              {conversations && conversations.length > 0 ? (
                <>
                  <select
                    onChange={(e) => handleSelectConversation(e.target.value)}
                    value={selectedConversation || ""}
                  >
                    <option value="" disabled>
                      Select a conversation
                    </option>
                    {conversations.map((conversation) => (
                      <option key={conversation._id} value={conversation._id}>
                        {
                          conversation.participants.find(
                            (p) => p !== userData._id
                          ) /* Afficher le nom du participant */
                        }
                      </option>
                    ))}
                  </select>

                  {/* Afficher les messages de la conversation sélectionnée */}
                  {selectedConversation && (
                    <div className="messages-container">
                      {activeMessages.map((message) => (
                        <div
                          key={message._id}
                          className={`message ${
                            message.sender === userData._id
                              ? "sent"
                              : "received"
                          }`}
                        >
                          <p>{message.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Formulaire pour envoyer un nouveau message */}
                  {selectedConversation && (
                    <form onSubmit={handleSendMessage} className="message-form">
                      <input
                        type="text"
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        placeholder="Type your message..."
                      />
                      <button type="submit">Send</button>
                    </form>
                  )}
                </>
              ) : (
                <p>No conversations available</p>
              )}
            </>
          ) : (
            <p>Please log in to view and send messages.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messenger;
