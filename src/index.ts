import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.get('/', (req, res) => {
    return res.send('ok')
})

app.listen(process.env.PORT)