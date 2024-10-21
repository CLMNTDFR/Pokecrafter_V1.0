import React, { useEffect, useState, useContext, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getConversations,
  getConversationMessages,
  sendMessage,
} from "../actions/conversation.actions";
import { getUsers } from "../actions/users.actions";
import LeftNav from "../components/LeftNav";
import { UidContext } from "../components/AppContext";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // Assurez-vous que l'URL correspond à celle de votre serveur backend

const Messenger = () => {
  const dispatch = useDispatch();
  const uid = useContext(UidContext);
  const userData = useSelector((state) => state.userReducer);
  const conversations = useSelector(
    (state) => state.conversationReducer?.conversations || []
  );
  const activeMessages = useSelector(
    (state) => state.conversationReducer.activeConversationMessages
  );
  const users = useSelector((state) => state.usersReducer);

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageContent, setMessageContent] = useState("");

  // Référence pour le conteneur des messages
  const messagesEndRef = useRef(null);

  // Charger les utilisateurs et les conversations au démarrage
  useEffect(() => {
    if (userData && userData._id) {
      dispatch(getConversations(userData._id));
      dispatch(getUsers()); // Charger les informations des utilisateurs
    }

    // Écoute pour les messages entrants via Socket.IO
    socket.on("receiveMessage", (message) => {
      // Ajouter directement le message aux messages actifs si la conversation est sélectionnée
      if (selectedConversation && message.conversationId === selectedConversation) {
        dispatch({
          type: "ADD_MESSAGE_TO_ACTIVE_CONVERSATION",
          payload: message,
        });
      }

      // Vous pouvez également mettre à jour la liste des conversations pour montrer les nouveaux messages
      dispatch(getConversations(userData._id));
    });

    // Cleanup: se déconnecter de Socket.IO quand le composant est démonté
    return () => {
      socket.disconnect();
    };
  }, [userData, dispatch, selectedConversation]);

  // Scroller automatiquement vers le bas lorsque les messages sont chargés ou modifiés
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeMessages]);

  // Rejoindre une conversation Socket.IO lorsqu'elle est sélectionnée
  const handleSelectConversation = (conversationId) => {
    if (selectedConversation === conversationId) {
      setSelectedConversation(null);
    } else {
      setSelectedConversation(conversationId);
      dispatch(getConversationMessages(conversationId));
      
      // Rejoindre la conversation via Socket.IO
      socket.emit("joinConversation", conversationId);
    }
  };

  // Envoyer un message dans la conversation active
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageContent.trim() && selectedConversation) {
      const messageData = {
        conversationId: selectedConversation,
        sender: userData._id,
        content: messageContent,
      };

      // Envoyer le message via l'action Redux et Socket.IO
      dispatch(sendMessage(selectedConversation, userData._id, messageContent));
      socket.emit("sendMessage", messageData);
      setMessageContent(""); // Réinitialiser le champ de saisie
    }
  };

  // Trouver le pseudo de l'autre utilisateur dans une conversation
  const getOtherParticipantUsername = (conversation) => {
    if (!conversation.participants || !userData || !userData._id) {
      return "Unknown";
    }

    const otherParticipantId = conversation.participants.find(
      (p) => p !== userData._id
    );
    const otherParticipant = users.find(
      (user) => user._id === otherParticipantId
    );

    return otherParticipant ? otherParticipant.username : "Unknown";
  };

  // Récupérer la photo de profil de l'autre utilisateur
  const getOtherParticipantProfilePic = (conversation) => {
    if (!conversation.participants || !userData || !userData._id) {
      return process.env.PUBLIC_URL + "/img/uploads/profil/random-user.png";
    }

    const otherParticipantId = conversation.participants.find(
      (p) => p !== userData._id
    );
    const otherParticipant = users.find(
      (user) => user._id === otherParticipantId
    );

    return otherParticipant && otherParticipant.picture
      ? otherParticipant.picture
      : process.env.PUBLIC_URL + "/img/uploads/profil/random-user.png";
  };

  const getMessageSenderName = (senderId) => {
    if (senderId === userData._id) {
      return "You";
    }

    const sender = users.find((user) => user._id === senderId);
    return sender ? sender.username : "Unknown";
  };

  return (
    <div className="home">
      <LeftNav />
      <div className="main">
        <div className="header-container">
          <h3 className="title-of-page">Message Box</h3>
          <br />
          <br />
        </div>
        <hr />

        <div className="messenger-container">
          {uid ? (
            <>
              {/* Liste des conversations */}
              {conversations && conversations.length > 0 ? (
                <ul>
                  {conversations.map((conversation) => {
                    const otherUsername =
                      getOtherParticipantUsername(conversation);
                    const otherProfilePic =
                      getOtherParticipantProfilePic(conversation);

                    // Ajouter une condition pour vérifier les messages non lus
                    const hasUnreadMessages = conversation.unreadCount > 0;

                    return (
                      <li key={conversation._id}>
                        <div
                          className={`conversation-item ${
                            hasUnreadMessages ? "unread" : ""
                          }`}
                          onClick={() =>
                            handleSelectConversation(conversation._id)
                          }
                        >
                          <img
                            src={otherProfilePic}
                            alt="profile-pic"
                            className="profile-pic"
                          />
                          <div className="conversation-info">
                            <h4>
                              {otherUsername}
                              {hasUnreadMessages && (
                                <span className="unread-badge"></span>
                              )}
                            </h4>
                            <p>{conversation.lastMessageContent}</p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>No conversations available</p>
              )}

              {/* Messages et formulaire de saisie */}
              {selectedConversation && (
                <div className="messages-container">
                  {activeMessages.map((message) => (
                    <div
                      key={message._id}
                      className={`message ${
                        message.sender === userData._id ? "sent" : "received"
                      }`}
                    >
                      <p
                        className={`message-sender ${
                          message.sender === userData._id ? "right" : "left"
                        }`}
                      >
                        {getMessageSenderName(message.sender)}
                      </p>
                      <p>{message.content}</p>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />

                  <form onSubmit={handleSendMessage} className="message-form">
                    <input
                      type="text"
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      placeholder="Type your message..."
                    />
                    <button type="submit">Send</button>
                  </form>
                </div>
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
