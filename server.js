require('dotenv').config();

const express = require('express');
const { PORT } = require('./config');
const connectToDB = require('./database/db');
const authRouter = require('./routes/auth-routes');
const userRouter = require('./routes/user-routes');
const homeRouter = require('./routes/home-routes');
const adminRouter = require('./routes/admin-routes');
const imageRouter = require('./routes/image-routes');

connectToDB()

const app  = express();

// Middleware
app.use(express.json());

//routes
app.use('/api/auth/', authRouter)
app.use('/api/users/', userRouter)
app.use('/api/admin/', adminRouter)
app.use('/api/home/', homeRouter)
app.use('/api/image/', imageRouter)


app.listen(PORT, () => {
    console.log(`El Server is now running on port:${PORT}`)
})