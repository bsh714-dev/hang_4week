const express = require('express');
const app = express();
const port = 3000;
const cookieParser = require('cookie-parser');
const indexRouter = require("./routes/index.js");
// const connect = require("./schemas");
// connect();
app.use(cookieParser())
app.use(express.json());
app.use("/", indexRouter);

app.listen(port, () => {
    console.log(port, '포트로 서버가 열렸어요!');
});

