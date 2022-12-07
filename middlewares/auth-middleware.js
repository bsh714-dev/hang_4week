const jwt = require('jsonwebtoken'); //jwt 사용
const { users } = require("../models");//데이터 베이스 유저 사용
const router = require('../routes/users');

//헤더에 전달된 토큰을 검증
module.exports = (req, res, next) => {//모듈로 바로 내보내는 미들웨어
    const { accesstoken } = req.cookies;

    console.log(accesstoken)
    //  try {//jwt 토큰 검증하는 과정
    const { id } = jwt.verify(accesstoken, "JMT_SECRET");
    users.findByPk(userId).then((user) => {
        console.log(user)
        res.locals.user = user;
        next();//다음 미들웨어로 넘겨줌 유저정보 조회할때 사용
    });
    // } catch (error) {
    //     console.log(error)
    //     res.status(401).json({ errorMessage: "로그인이 필요합니다." });
    // }
};