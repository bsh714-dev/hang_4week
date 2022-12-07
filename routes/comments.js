const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const { comments } = require('../models');


//댓글 생성
router.post('/:postId', authMiddleware, async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId, nickname } = res.locals.user;
        const { comment } = req.body;
        if (comment === "") {
            return res.status(400).json({ errorMessage: "댓글 내용을 입력해주세요." })
        }
        await comments.create({ postId, userId, nickname, comment });
        res.status(200).json({ "message": "댓글을 작성하였습니다." })
    } catch (error) {
        console.log(error)
        res.status(400).send({ errorMessage: "댓글 작성에 실패하였습니다." });
    }
});

//댓글 조회
router.get('/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        const existPosts = await comments.findAll({
            attributes: { exclude: ['postId'], },
            where: { postId },
            order: [['createdAt', 'DESC']],
        })

        if (existPosts.length) {
            res.status(200).json({ existPosts });
        } else {
            return res.status(400).json({ errorMessage: "존재하지 않는 게시글의 댓글입니다." })
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({ "message": "댓글 목록 조회에 실패하였습니다." });
    }
});
//댓글수정
router.put("/:commentId", authMiddleware, async (req, res) => {
    const { commentId } = req.params;
    const { comment } = req.body;
    const { userId } = res.locals.users;

    await comments.update({ comment }, {
        where: {
            commentId,
            userId,
        }
    })

    res.status(201).json({ "message": "댓글을 수정하였습니다." })
})

//5. 댓글 삭제하기
router.delete("/:commentId", authMiddleware, async (req, res) => {
    const { commentId } = req.params;
    const { userId } = res.locals.users;

    await comments.destroy({
        where: {
            commentId,
            userId,
        }
    });

    res.json({ "message": "댓글을 삭제하였습니다." })
})



module.exports = router;