const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        default: function() {
            let end = new Date();
            end.setDate(end.getDate() + 7);
            return end;
        }
    },
    description: {
        type: String,
        required: true,
        maxlength: 240,
    },
    artworks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ArtworkContest' }], // Ajout du tableau pour les artworks

});

const Contest = mongoose.model('Contest', contestSchema);

module.exports = Contest;
