import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/index.js';
import config from 'config'

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(router)

const PORT = process.env.PORT || config.get('port');

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});