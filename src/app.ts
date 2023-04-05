import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express'

import routes from './routes/router';
import swaggerDocs from './swagger.json'

const app = express();

app.use(cors())
app.use(express.json())
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use(routes);


export default app;