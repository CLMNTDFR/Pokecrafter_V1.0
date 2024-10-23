const mongoose = require('mongoose');

// Define the Contest model.

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
    artworks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ArtworkContest', default: [] }],

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    creatorRole: {
        type: String,
        enum: ['user', 'admin', 'super-admin'],
        required: true,
    },
    isCompleted: { type: Boolean, default: false },
});

const Contest = mongoose.model('Contest', contestSchema);

module.exports = Contest;
