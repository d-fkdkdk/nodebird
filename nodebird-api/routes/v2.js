const express = require("express");
const { verifyToken, apiLimiter } = require("../middlewares");
const {
  createToken,
  tokenTest,
  getMyPosts,
  getPostsByHashtag,
} = require("../controllers/v2");

const router = express.Router();

router.post("/token", apiLimiter, createToken);

router.get("/test", verifyToken, apiLimiter, tokenTest);

router.get("/posts/my", verifyToken, apiLimiter, getMyPosts);

// GET /v2/posts/hashtag/:title
router.get("/posts/hashtag/:title", verifyToken, apiLimiter, getPostsByHashtag);

module.exports = router;
