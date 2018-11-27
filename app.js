import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/index.js';
import config from 'config'

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(router)

const PORT = 5000;

console.log('****' + process.env.NODE_ENV)

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});