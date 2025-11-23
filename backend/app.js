const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRouter = require('./routes/auth.routes');
const productRouter = require('./routes/products.routes');
const uploadRouter = require('./routes/uploads.routes');
const historyRouter = require('./routes/history.routes');
const authMiddleware = require('./middleware/auth.middleware');

dotenv.config();
const app = express();

const corsOptions = {
    origin: "*"
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', authRouter);
app.use('/api', authMiddleware, productRouter);
app.use('/api', authMiddleware, uploadRouter);
app.use('/api', authMiddleware, historyRouter);

app.get('/check',(req,res)=>{
    res.send("Server is Alive");
})

module.exports = app;