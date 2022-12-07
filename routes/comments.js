const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const { comments } = require('../models');


//댓글 생성
router.post('/:postId', async (req, res) => {
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
        res.status(400).send({ errorMessage: "댓글 조회에 실패하였습니다." });
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

router.put("/:commentId", authMiddleware, async (req, res) => {
    try {
        const { commentId } = req.params;
        const { comment } = req.body;

        const existPosts = await comments.findId(commentId);
        if (existPosts) {
            await comments.update(
                { comment: comment },
                { where: { content } }
            );
            res.status(200).json({ "message": "게시글을 수정하였습니다." });
        } else {
            res.status(400).json({ errorMessage: "댓글이 존재하지 않습니다." })
        };
    } catch (error) {
        console.log(error)
        res.status(400).send({ "message": "댓글 수정에 실패하였습니다." });
    }
});

//댓글 삭제
router.delete("/:commentId", async (req, res) => {
    const { commentId } = req.params;
    //코멘트 아이디
    const comment = await comments.findByPk(commentId);
    try {
        if (comment) {
            await comment.destroy({ where: { commentId } })
            res.status(200).json({ "message": "댓글을 삭제하였습니다." })
        } else {
            res.status(400).json({ errorMessage: "댓글이 존재하지 않습니다." })
        }
    } catch (error) {
        res.status(400).json({ errorMessage: "댓글 삭제에 실패했습니다." });
    }
});



module.exports = router;