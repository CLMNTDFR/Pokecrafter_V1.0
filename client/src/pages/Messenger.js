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
import { Link } from "react-router-dom";

// Initialize Socket.IO connection
const socket = io(process.env.REACT_APP_API_URL);

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
  const [searchTerm, setSearchTerm] = useState("");

  // Reference for the messages container
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Load users and conversations on startup
  useEffect(() => {
    if (userData && userData._id) {
      dispatch(getConversations(userData._id));
      dispatch(getUsers());
    }

    // Listen for incoming messages via Socket.IO
    socket.on("receiveMessage", (message) => {
      // Directly add the message to the active messages if the conversation is selected
      if (
        selectedConversation &&
        message.conversationId === selectedConversation
      ) {
        dispatch({
          type: "ADD_MESSAGE_TO_ACTIVE_CONVERSATION",
          payload: message,
        });
      }

      // You can also update the conversation list to show new messages
      dispatch(getConversations(userData._id));
    });

    // Cleanup: disconnect from Socket.IO when the component is unmounted
    return () => {
      socket.disconnect();
    };
  }, [userData, dispatch, selectedConversation]);

  // Automatically scroll to the bottom when messages are loaded or changed
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeMessages]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [activeMessages]);

  // Join a Socket.IO conversation when it is selected
  const handleSelectConversation = (conversationId) => {
    if (selectedConversation === conversationId) {
      setSelectedConversation(null);
    } else {
      setSelectedConversation(conversationId);
      dispatch(getConversationMessages(conversationId));

      // Join the conversation via Socket.IO
      socket.emit("joinConversation", conversationId);
    }
  };

  // Send a message in the active conversation
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageContent.trim() && selectedConversation) {
      const messageData = {
        conversationId: selectedConversation,
        sender: userData._id,
        content: messageContent,
      };

      // Send the message via Redux action and Socket.IO
      dispatch(sendMessage(selectedConversation, userData._id, messageContent));
      socket.emit("sendMessage", messageData);
      setMessageContent("");
    }
  };

  // Find the username of the other user in a conversation
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

  // Retrieve the profile picture of the other user
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

  // Retrieve the name of the message sender
  const getMessageSenderName = (senderId) => {
    if (senderId === userData._id) {
      return "You";
    }

    const sender = users.find((user) => user._id === senderId);
    return sender ? sender.username : "Unknown";
  };

  // Filter conversations based on the search term
  const filteredConversations = conversations.filter((conversation) => {
    const otherUsername = getOtherParticipantUsername(conversation);
    return otherUsername.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
              <div className="messenger-search-container">
                <input
                  type="text"
                  placeholder="Search for a conversation"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="messenger-search-bar"
                />
              </div>

              {filteredConversations && filteredConversations.length > 0 ? (
                <ul>
                  {filteredConversations.map((conversation) => {
                    const otherUsername =
                      getOtherParticipantUsername(conversation);
                    const otherProfilePic =
                      getOtherParticipantProfilePic(conversation);

                    const hasUnreadMessages = conversation.unreadCount > 0;

                    return (
                      <React.Fragment key={conversation._id}>
                        <li>
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
                              alt="pokecrafter-profile-pic"
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

                        {selectedConversation === conversation._id && (
                          <div
                            className="messages-container"
                            ref={messagesContainerRef}
                          >
                            {activeMessages.map((message) => (
                              <div
                                key={message._id}
                                className={`message ${
                                  message.sender === userData._id
                                    ? "sent"
                                    : "received"
                                }`}
                              >
                                <p
                                  className={`message-sender ${
                                    message.sender === userData._id
                                      ? "right"
                                      : "left"
                                  }`}
                                >
                                  {getMessageSenderName(message.sender)}
                                </p>
                                <p>{message.content}</p>
                              </div>
                            ))}
                            <div ref={messagesEndRef} />

                            <form
                              onSubmit={handleSendMessage}
                              className="message-form"
                            >
                              <input
                                type="text"
                                value={messageContent}
                                onChange={(e) =>
                                  setMessageContent(e.target.value)
                                }
                                placeholder="Type your message..."
                              />
                              <button type="submit">Send</button>
                            </form>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </ul>
              ) : (
                <p>No conversations available</p>
              )}
            </>
          ) : (
            <div className="centered-container">
              <Link to="/profil" className="please-login">
                Merci de vous connecter pour utiliser la boite à messages
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messenger;
