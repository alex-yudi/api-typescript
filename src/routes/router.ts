import { Router } from "express";

const routes = Router();

routes.get('/', async (req, res) => {
    return res.send('ok')
})

export default routes;
