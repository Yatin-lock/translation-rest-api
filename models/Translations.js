const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const translationSchema = new Schema({
    text: [String],
    languages: [String]
})

const Translations = mongoose.model('Translation',translationSchema);
module.exports = Translations