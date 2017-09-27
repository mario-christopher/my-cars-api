import express from "express";
import cors from 'cors';

import { router as apiRouter } from './api/api';
import { logUrl } from './middleware/log-url';
import { initDb } from './db/util';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(logUrl);
app.use('/', apiRouter);

app.listen(PORT, () => {
    initDb();
    if (process.env.NODE_ENV == 'dev')
        console.log(`'Running ${process.env.NODE_ENV} server on http://localhost:${PORT}'`);
    else
        console.log(`'Running ${process.env.NODE_ENV} server on port: ${PORT}'`);
});