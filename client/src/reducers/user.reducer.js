const initialState = {}; // Ou n'importe quel état initial que tu veux

export default function userReducer(state = initialState, action) { // Assure-toi de fournir l'état initial ici
    switch (action.type) {
        // Ajoute tes actions ici
        default:
            return state; // Toujours renvoyer l'état par défaut si aucune action n'est reconnue
    }
}
