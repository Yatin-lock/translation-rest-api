// setting up dependencies
const express = require('express');
const translate = require('translate-google-api');
const app = express();

//Translation Schema 
const Translations = require('./models/Translations');

// parsing data using json
app.use(express.json());

//setting up the database
const mongoose = require('mongoose');
const { response } = require('express');
mongoose.connect('mongodb://localhost:27017/translation')
    .then(res => console.log(`database connected`))
    .catch(e => console.log('error connecting databse', err))

/*
req.body must contain :{
    text: 'TEXT_TO_BE_CONVERTED'
    src: 'SOURCE_LANGUAGE'
    to: 'DESTINATION LANGUAGE'
}
*/
app.post('/', async (req, res) => {
    const { text, src, to } = req.body;
    await Translations.findOne(
        { text: text, languages: to },
        async (err, doc) => {
            if (err) res.status(401).send({
                ...err,
                isTranslated: false,
                reason: "Invalid Input"
            });
            if (doc) {
                let responseText;
                if (doc.text[0] === text)
                    responseText = doc.text[1];
                else responseText = doc.text[0];
                res.send({
                    isTranslated: true,
                    text: responseText
                });
            }
            if (!doc) {
                try {
                    const responseText = await translate(text, {
                        tld: 'cn',
                        to,
                    })
                    const newTranslation = new Translations({
                        text: [text, responseText[0]],
                        languages: [src, to]
                    })
                    try {
                        await newTranslation.save();
                        res.send({
                            isTranslated: true,
                            text: responseText[0]
                        });
                    } catch (e) {
                        res.status(401).send({
                            ...e,
                            isTranslated: false,
                            reason: "Invalid Input"
                        })
                    }
                } catch (e) {
                    res.status(400).send({ ...e, isTranslated: false, reason: "Invalid Input" });
                }
            }
        })
    res.status(404).send({ isTranslated: false, reason: "No resource found" });
})

//server port and listener
let server = app.listen(3000, (req, res) => {
    console.log(`listening on port 3000`);
})

module.exports = server;

