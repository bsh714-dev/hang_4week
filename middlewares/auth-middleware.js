const jwt = require('jsonwebtoken'); //jwt 사용
const { users } = require("../models");//데이터 베이스 유저 사용
//헤더에 전달된 토큰을 검증
module.exports = (req, res, next) => {//모듈로 바로 내보내는 미들웨어
    const { authorization } = req.headers;
    const [authType, authToken] = (authorization || "").split(" ");//배열구조분해할당
//authType : Bearer
//authToken : 실제 jwt 값이 들어온다.
console.log(authToken) 
if (!authToken || authType !== "Bearer") {//Bearer 타입이 아니거나 값이 비었을경우
        res.status(401).send({
            errorMessage: "로그인이 필요한 기능입니다.",
        });
        return;
    }

    try {//jwt 토큰 검증하는 과정
        const { userId } = jwt.verify(authToken, "JMT_SECRET");
        users.findByPk(userId).then((user) => {
            console.log(user)
            res.locals.user = user;
            next();//다음 미들웨어로 넘겨줌 유저정보 조회할때 사용
        });
    } catch(error) {
        console.log(error)
        res.status(401).json({ errorMessage: "로그인이 필요합니다." });
    }
};
// res.locals.user = user; 는 무슨 코드인가요?
    
//     우리는 토큰에 담긴 `userId`로 해당 사용자가 실제로 존재하는지 확인했습니다.
    
//     이미 데이터베이스에서 사용자 정보를 가져온것이죠.
//     이 미들웨어를 사용하는 라우터에서는 굳이 **데이터베이스에서 사용자 정보를 가져오지 않게 할 수 있도록** `express`가 제공하는 안전한 변수에 담아두고 언제나 꺼내서 사용할 수 있게 작성했습니다!
    
//     이렇게 담아둔 값은 정상적으로 응답 값을 보내고 나면 소멸하므로 해당 데이터가 어딘가에 남아있을 걱정의 여지를 남겨두지 않게 됩니다