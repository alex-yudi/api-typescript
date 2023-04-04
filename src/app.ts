import express from 'express';
import routes from './routes/router';
import cors from 'cors';

const app = express();

app.use(cors())
app.use(routes);


export default app;