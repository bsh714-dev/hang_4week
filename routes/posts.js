const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const authMiddleware = require('../middlewares/auth-middleware');

const { posts, likes, sequelize } = require('../models');
//게시글 작성
router.post("/", authMiddleware, async (req, res) => {
  const { userId, nickname } = res.locals.user;
  const { title, content } = req.body;
  try {

    if (req.body == 0) {
      return res.status(400).json({ success: false, errorMessage: "데이터 형식이 올바르지 않습니다." });
    }
    await posts.create({ userId, nickname, title, content });
    res.status(200).send({ "message": "게시글을 생성하였습니다." });
  } catch (error) {
    console.log(error)
    res.status(400).send({ "message": "데이터 형식이 올바르지 않습니다." });
  }
});

//게시글 목록 조회
router.get("/", async (req, res) => {
  try {
    const data = await posts.findAll({
      attributes: { exclude: ['content'], },//attribute 속성
      order: [['createdAt', 'DESC']]//정렬방식
    })
    res.json({ data });
  } catch (error) {
    res.status(400).json({ errorMessage: "게시글 목록 조회에 실패했습니다." })
  }
});
//게시글 상세조회
router.get('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const existPosts = await posts.findOne({ where: { postId } })
    if (!existPosts) {
      return res.status(400).json({ success: false, errorMessage: "게시글이 존재하지 않습니다." });
    }

    res.json({ "data": existPosts });
  } catch (error) {
    console.log(error)
    res.status(400).send({ errorMessage: "게시글 조회에 실패하였습니다." });
  }
});
//게시글 수정 API
router.put("/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content } = req.body;

    const existPosts = await posts.findId({ postId });

    if (existPosts) {
      await posts.update({ title, content }, { where: { postId } });
      res.status(400).json({ "message": "게시글을 수정하였습니다." });
    } else {
      res.status(400).json({ errorMessage: "게시글이 존재하지 않습니다." })
    }

  } catch (error) {
    console.log(error)
    res.status(400).send({ "message": "게시글 수정에 실패하였습니다." });
  }
})
//게시글 삭제
router.delete("/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;

    const existPosts = await posts.findByPk(postId);
    if (existPosts) {
      await posts.destroy({ where: { postId } })
      res.status(200).json({ "message": "게시글을 삭제하였습니다." })
    } else {
      res.status(400).json({ errorMessage: "게시글이 존재하지 않습니다." })
    }
  } catch (error) {
    console.log(error)
    res.status(400).send({ errorMessage: "게시글 삭제에 실패했습니다." });
  }
});
//좋아요 갯수
router.get('/like', authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  console.log(userId);
  const [arr] = await sequelize.query("SELECT * FROM Posts JOIN Likes ON Likes.postId = Posts.postId");

  const likePosts = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].userId === userId) {
      likePosts.push(arr[i]);
    }
  }
  res.json({ likePosts });
});

//좋아요 누르기
router.put('/:postId/like', authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { userId } = res.locals.user;

  try {
    const currentLike = await likes.findOne({ where: [{ postId }, { userId }] })

    if (!currentLike) {
      await likes.create({ postId, userId });
      await posts.increment({ likesCount: 1 }, { where: { postId } })
      res.status(200).json({ "message": "게시글의 좋아요를 등록하였습니다." });
    } else {
      await likes.destroy({ where: [{ postId }, { userId }] });
      await posts.decrement({ likesCount: 1 }, { where: { postId } })
      res.status(200).json({ "message": "게시글의 좋아요를 취소하였습니다." });
    }
  } catch (err) {
    console.log(err)
    res.status(400).json({ errorMessage: "좋아요 실패!" });
  }
});



module.exports = router;