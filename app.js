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
    .then(res=>console.log(`database connected`))
    .catch(e=>console.log('error connecting databse',err))

/*
req.body must contain :{
    text: 'TEXT_TO_BE_CONVERTED'
    src: 'SOURCE_LANGUAGE'
    to: 'DESTINATION LANGUAGE'
}

*/
app.post('/',async(req,res)=>{
    const {text, src, to='en'} = req.body;
    await Translations.findOne(
        {text: text, languages: to},
        async(err,doc)=>{
        if(err) throw err;
        if(doc){
            let responseText;
            if(doc.text[0]===text)
                responseText = doc.text[1];
            else responseText = doc.text[0];
            res.send(responseText);
        }
        if(!doc){
            try{
                const responseText = await translate(text,{
                    tld: 'cn',
                    to,
                })
                const newTranslation = new Translations({
                    text: [text, responseText[0]],
                    languages: [src,to]
                })
                await newTranslation.save();
                res.send(responseText[0]);
            } catch(e){
                res.send(e);
            }
        }
    })
    res.status(404);
})

//server port and listener
app.listen(3000,(req,res)=>{
    console.log(`listening on port 3000`);
})