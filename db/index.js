const mongoose = require('mongoose');
const DB_URL = process.env.DB_URL||'mongodb://localhost:27017/myapp';

function connect() {
  return new Promise((resolve, reject) => {
    mongoose.connect(DB_URL,{ useNewUrlParser: true, useCreateIndex: true })
        .then((res, err) => {
            if (err) return reject(err);
            resolve();
        })
    });
}

function close() {
  return mongoose.disconnect();
}

module.exports = { connect, close };