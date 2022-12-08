const jwt = require('jsonwebtoken'); //jwt 사용
const { users } = require("../models");//데이터 베이스 유저 사용

//헤더에 전달된 토큰을 검증
module.exports = (req, res, next) => {//모듈로 바로 내보내는 미들웨어
    console.log(req.cookies)
    const { accessToken } = req.cookies

    if (!accessToken) {
        res.status(401).send({ errorMessage: "로그인 후 이용 가능한 기능입니다.", });
        return;
    }

    try {
        const { userId } = jwt.verify(accessToken, "JMT_SECRET");
        users.findByPk(userId).then((user) => {
            res.locals.user = user;
            next();
        });
    } catch (err) {
        console.log(err)
        res.status(401).send({
            errorMessage: "인증에 실패했습니다.",
        });
    }
};