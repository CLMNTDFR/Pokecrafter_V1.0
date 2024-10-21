import axios from 'axios';

// Actions Types
export const GET_CONVERSATIONS = "GET_CONVERSATIONS";
export const GET_CONVERSATION_MESSAGES = "GET_CONVERSATION_MESSAGES";
export const SEND_MESSAGE = "SEND_MESSAGE";
export const CREATE_CONVERSATION = "CREATE_CONVERSATION";

// URL de base de l'API depuis les variables d'environnement
const API_URL = process.env.REACT_APP_API_URL;

// Récupérer toutes les conversations de l'utilisateur connecté
export const getConversations = (userId) => {
    return async (dispatch) => {
        console.log("Fetching conversations for user:", userId); // Ajoute ceci pour voir si userId est bien défini
        try {
            // Utiliser la variable d'environnement pour définir l'URL
            const res = await axios.get(`${API_URL}conversations/user/${userId}`);
            dispatch({ type: GET_CONVERSATIONS, payload: res.data });
        } catch (error) {
            console.error("Error fetching conversations:", error);
        }
    };
};

// Récupérer les messages d'une conversation spécifique
export const getConversationMessages = (conversationId) => {
    return async (dispatch) => {
        try {
            // Utiliser la variable d'environnement pour définir l'URL
            const res = await axios.get(`${API_URL}conversations/${conversationId}/messages`);
            dispatch({ type: GET_CONVERSATION_MESSAGES, payload: res.data });
        } catch (error) {
            console.error("Error fetching conversation messages:", error);
        }
    };
};

// Envoyer un message dans une conversation
export const sendMessage = (conversationId, senderId, content) => {
    return async (dispatch) => {
        console.log(`Sending message: ${content} to conversation: ${conversationId}`);
        try {
            // Assurez-vous que withCredentials est ajouté pour envoyer les cookies
            const res = await axios.post(
                `${API_URL}messages`, 
                { conversationId, sender: senderId, content }, 
                { withCredentials: true }
            );
            dispatch({ type: SEND_MESSAGE, payload: res.data });
            dispatch(getConversationMessages(conversationId)); // Mettre à jour les messages
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };
};

export const getMessageById = (messageId) => async (dispatch) => {
    try {
      const res = await axios.get(`/api/messages/${messageId}`);
      return res.data;
    } catch (err) {
      console.error(err);
    }
  };

export const createConversation = (userId1, userId2) => {
  return async (dispatch) => {
    try {
        const response = await axios.post(
            `${API_URL}conversations`,
            {
              participants: [userId1, userId2],
            }
          );
          
      
      // Vous pouvez déclencher un dispatch ici pour mettre à jour la liste des conversations
      dispatch({
        type: "CREATE_CONVERSATION_SUCCESS",
        payload: response.data,
      });

      return response.data; // Retourne les données de la conversation créée
    } catch (err) {
        console.error(err);
        return { error: 'Erreur lors de la création de la conversation.' };
      }
      
  };
};
