const testCases = {
    statusCode200: [
        {
            "src": "fr",
            "to": "ar",
            "text": "Ceci est un texte anglais"
        },
        {
            "src": "fr",
            "to": "en",
            "text": "Ceci est un texte anglais"
        },
        {
            "src": "en",
            "to": "fr",
            "text": "This is an English text"
        },
        {
            "src": "en",
            "to": "fr",
            "text": "Simple english text"
        },
        {
            "src": "fr",
            "text": "Ceci est un texte anglais"
        },
        {
            "to": "ar",
            "text": "Ceci est un texte anglais"
        },
        {
            "src": "fr",
            "to": "ar",
            "text": "Ceci est un texte anglais"
        },
        {
            "src": "fr",
            "to": "en",
            "text": "Ceci est un texte anglais"
        },
    ],
    statusCode400: [
        {
            "src": "fr",
            "to": "ar"
        },
        {
            "src": "fr"
        }
    ],
    statusCode404: [
        {
            "src": "fr",
            "to": "ar",
            "text": "Ceci est un texte anglais"
        },
        {
            "src": "fr",
            "to": "en",
            "text": "Ceci est un texte anglais"
        },
        {
            "src": "en",
            "to": "fr",
            "text": "Simple english text"
        },
        {
            "to": "ar",
            "text": "Ceci est un texte anglais"
        }
    ]
}

module.exports = testCases;