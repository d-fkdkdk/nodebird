const Post = require("../models/post");
const Hashtag = require("../models/hashtag");

exports.afterUploadImage = (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
};

exports.uploadPost = async (req, res, next) => {
  //req.body.content, req.body.url
  try {
    // 노드교과서 너무 재밌어요. #노드교과서 #익스프에스 짱짱
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
    });
    //정규표현식 #해시태그 ^ \s공백이 아닌 나머지 #
    const Hashtags = req.body.content.match(/#[^\s#]*/g);
    if (Hashtags) {
      //없으면 가져오기
      const result = await Promise.all(
        Hashtags.map((tag) => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          });
        })
      );
      console.log("result", result);
      //포스트랑 해시태그랑 다대다 관계형성
      await post.addHashtags(result.map((r) => r[0]));
    }
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
};
