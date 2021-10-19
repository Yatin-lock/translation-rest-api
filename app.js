// setting up dependencies
if(process.env.NODE_ENV!=="production"){
    require('dotenv').config()
}
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
const dbURL = process.env.DB_URL;
mongoose.connect(dbURL)
    .then(res => console.log(`database connected`))
    .catch(e => console.log('error connecting databse', err))

/*
req.body must contain :{
    text: 'TEXT_TO_BE_CONVERTED'
    src: 'SOURCE_LANGUAGE_NOT_NECESSARY' 
    to: 'DESTINATION LANGUAGE'
}
*/
app.post('/', async (req, res) => {
    //destructuring text src and to from req.body 
    const { text, src, to = 'en' } = req.body;
    //pre checking from the databse for cache hit
    await Translations.findOne(
        { text: text, languages: to }, // this checks for both converted and source text
                                       //  hit from database and also the language
        async (err, doc) => {
            if (err) res.status(500).send({ // if there is any error connecting the database return a 500 status code
                ...err,
                isTranslated: false,
                reason: "Server Database Error"
            });
            if (doc) {
                // if the item exists in the database execute the following
                let responseText;
                if (doc.text[0] === text) //checks if the previous source text matches 
                    responseText = doc.text[1]; // current source text and returning the converted form
                else responseText = doc.text[0]; // if it doesn't match with source text it will surely 
                                                // match the converted one hence returning the source text
                res.send({
                    isTranslated: true,
                    text: responseText
                });// sending server response from cache
            }
            if (!doc) { // if there is no cache hit executing this
                try {
                    // using the translation api 
                    const responseText = await translate(text, {
                        tld: 'cn',
                        to,
                    })
                    // saving the current translation in database
                    const newTranslation = new Translations({
                        text: [text, responseText[0]],
                        languages: [src, to]
                    })
                    try {
                        //savig in the database
                        await newTranslation.save();
                        res.send({
                            isTranslated: true,
                            text: responseText[0]
                        });
                    } catch (e) {
                        //checking for incorrect schema format(very less likely to happen)
                        res.status(400).send({
                            ...e,
                            isTranslated: false,
                            reason: "Invalid Input"
                        })
                    }
                } catch (e) {
                    // if any error is encountered while translating responding with 400 status code
                    res.status(400).send({ ...e, isTranslated: false, reason: "Invalid Input" });
                }
            }
        })
    // Default response control will not reach this point
    res.status(404).send({ isTranslated: false, reason: "No resource found" });
})


app.get('*',(req,res)=>{
    res.status(404).send({ isTranslated: false, reason: "No resource found" });
})
//server port and listener
let server = app.listen(3000, (req, res) => {
    console.log(`listening on port 3000`);
})

// server export for testing
module.exports = server;

