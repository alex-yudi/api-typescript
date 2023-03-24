import express from 'express';
import routes from './routes/router';

const app = express();

app.use(routes);


export default app;