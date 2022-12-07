const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");

const { users } = require('../models');

// 회원 가입 API
router.post("/signup", async (req, res) => {
    const { nickname, password, confirm } = req.body;

    if (password != confirm) {
        res.status(400).send({
            errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
        });
        return;
    }

    try {
        const existsUser = await users.findOne({ where: { nickname } });//일치하는 닉네임 검색
        console.log(existsUser);
        if (existsUser) {//참이라면
            res.status(400).json({ errorMessage: "중복된 닉네임입니다." });
            return;
        }//거짓이라면
        await users.create({ nickname, password });
        res.status(201).json({ message: "회원 가입 완료!" });
    } catch (error) {
        res.status(400).json({ errorMessage: "회원 가입에 실패했습니다." });
    }
});

router.post("/login", async (req, res) => {
    const { nickname, password } = req.body;
    try {
        const user = await users.findOne({ where: { nickname } });

        if (!user || password !== user.password) {
            res.status(400).json({ errorMessage: "닉네임 또는 패스워드를 확인해주세요." });
            return;
        }

        res.send({
            token: jwt.sign({ userId: user.userId }, "JMT_SECRET", { expiresIn: '15m' })
            // token: jwt.sign({ userId: user.userId }, "my-secret-key"),
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({ errorMessage: "로그인에 실패했습니다." });
    }
});

const authMiddleware = require("../middlewares/auth-middleware");

router.get("/users/me", authMiddleware, async (req, res) => {
    res.send({ user: res.locals.user });
});

module.exports = router;