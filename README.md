# TRANSLATION-API

## Setting up the Server
To setup the server, download the zip file extract it and run the command

    npm install

## Run the app

    node app.js

## Run the tests

    npm test

# REST API

The REST API to the translations app is described below.

## API Reference

The API consists of only a single POST request that is described below.

### Sample Request

`POST /`

    curl --location --request POST 'http://localhost:3000/' \
    --header 'Content-Type: application/json' \
    --data-raw '   {
	    "src": "en",
	    "to": "ar",
	    "text": "this is a sample text in english",
    }	'

The POST request firstly checks in the database for already available translations.

If there are no available translations available in the database `translate-google-api` is called.

The `translate-google-api` auto detects the source language.

It converts the text in the destination language.

The translated text, the source text, the source language, the destination language are stored in the database.


The POST request expects its body to be an *Object* with the given paramters.

    {
        src: 'THE_SOURCE_LANGUAGE'
        to: 'THE_DESTINATION_LANGUAGE'
        text: 'THE_TEXT_TO_BE_CONVERTED'
    }

`src` and `to` expects the languages in `ISO-639-1 Code`.

[List of Language mapping with `ISO-639-1 Code`](https://cloud.google.com/translate/docs/languages).

The parameters `src` and `to` are given a default value `'en'`.
It stands for the english language in `ISO-639-1 Code`.

The parameter text expects the text to be converted in to the `to` or destination language.

### Response

    {
        "isTranslated": true,
        "text": "هذا نص نموذج باللغة الإنجليزية"
    }

The response object ( or the body of response object) consists of the property `isTranslated` .

The property is set to `true` if either there is a cache hit or the `translate-google-api` is used succesfully.

Otherwise, it is set to be `false`.

Whenever this happens the server responds with a 400 or a 500 status code

The `text` property contains the translated text.

The property is empty if `isTranslated` is false.

Besides these if `isTranslated` is false it contains and additional property `reason`

`Reason` tells the reason for failure of the request made

### Cache Database Schema

The cache is centred around mongodb Database(NO SQL).

The Schema can be easily accessed in the `models` folder, it is named `Translations.js`

The cache is primarily stored in the `translations` collections.

The `translations` collection has the following Schema design.

    translation: {
        text: [String],
        languages: [String]
    }
Here `text` is an array of Strings and has only two Strings.

The 0-indexed String is the text in source language. 

The 1-indexed String is the text in destination language.

The `languages` property is an array of Strings that has only two Strings.

The 0-indexed String is the source language .

The 1-indexed String is the destination language.

### Result Evaluation

The code was tested against multiple testcases covering almost every boderline case.

The test-cases are divided according to their response behaviour.

The cases are judged on the basis of their expected time and response.

There are broadly 3 types of testcases

1. `404-status-code`: expected status code response is 404

2. `200-status-code`: expected status code reponse is 200, isTranslated: true 

3. `400-status-code`: expected status response is 400.

The `200-status-code` testcases were further judged on basis of their expected response time, i.e. if they were a part of the cache hit their response time is expected to be less than their counterparts.

### Ideas for further Improvement

1. **Smart pre-caching**: The API currently doesnot have *smart pre-caching* feature available which can be added by recognising similar language patterns.

2. **SQL based database** The project utilizes mongodb which is a NO-SQL database. Which can be converted to a SQL based one.

3. **More consistent translation API**: The translation api used provide different results on converting and counter-converting which can be reduced by using a better api.

4. **API protection with API key**: The API can be integrated with an API key such as to limit access to frequent and real users.

5. **Machine learning modules for speech to text**: A machine learning or AI module can be incorporated to convert one's speech into another language's speech.
