const express = require("express");
const mongoose = require("mongoose");

const AuthR = require("./routes/AuthRoutes");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use("/api",AuthR);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Connected to MongoDB")
})
.catch((err) => {
    console.log(err)
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
        });