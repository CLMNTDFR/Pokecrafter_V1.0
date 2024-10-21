import axios from "axios";

// Actions Types
export const GET_CONVERSATIONS = "GET_CONVERSATIONS";
export const GET_CONVERSATION_MESSAGES = "GET_CONVERSATION_MESSAGES";
export const SEND_MESSAGE = "SEND_MESSAGE";
export const CREATE_CONVERSATION = "CREATE_CONVERSATION";

// Base URL for API from environment variables
const API_URL = process.env.REACT_APP_API_URL;

// Retrieve all conversations for the connected user
export const getConversations = (userId) => {
  return async (dispatch) => {
    try {
      // Use the environment variable to set the URL
      const res = await axios.get(`${API_URL}conversations/user/${userId}`);
      dispatch({ type: GET_CONVERSATIONS, payload: res.data });
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };
};

// Retrieve messages from a specific conversation
export const getConversationMessages = (conversationId) => {
  return async (dispatch) => {
    try {
      // Use the environment variable to set the URL
      const res = await axios.get(
        `${API_URL}conversations/${conversationId}/messages`
      );
      dispatch({ type: GET_CONVERSATION_MESSAGES, payload: res.data });
    } catch (error) {
      console.error("Error fetching conversation messages:", error);
    }
  };
};

// Send a message in a conversation
export const sendMessage = (conversationId, senderId, content) => {
  return async (dispatch) => {
    try {
      // Ensure withCredentials is added to send cookies
      const res = await axios.post(
        `${API_URL}messages`,
        { conversationId, sender: senderId, content },
        { withCredentials: true }
      );
      dispatch({ type: SEND_MESSAGE, payload: res.data });
      dispatch(getConversationMessages(conversationId)); // Update messages
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
};

// Get a message by ID
export const getMessageById = (messageId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/messages/${messageId}`);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

// Create a new conversation between two users
export const createConversation = (userId1, userId2) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${API_URL}conversations`, {
        participants: [userId1, userId2],
      });

      // You can dispatch here to update the conversation list
      dispatch({
        type: "CREATE_CONVERSATION_SUCCESS",
        payload: response.data,
      });

      return response.data; // Return the created conversation data
    } catch (err) {
      console.error(err);
      return { error: "Error creating conversation." };
    }
  };
};
