import { GET_CONVERSATIONS, GET_CONVERSATION_MESSAGES, SEND_MESSAGE } from "../actions/conversation.actions";

const initialState = {
    conversations: [], // État initialisé pour éviter l'accès à undefined
    activeConversationMessages: [],
    loading: false,
    error: null,
  };

export default function conversationReducer(state = initialState, action) {
    switch (action.type) {
        case GET_CONVERSATIONS:
            return {
                ...state,
                conversations: action.payload,
            };
        case GET_CONVERSATION_MESSAGES:
            return {
                ...state,
                activeConversationMessages: action.payload,
            };
        case SEND_MESSAGE:
            return {
                ...state,
                activeConversationMessages: [...state.activeConversationMessages, action.payload],
            };
        default:
            return state;
    }
}
