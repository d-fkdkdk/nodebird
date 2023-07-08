const passport = require("passport");
const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");
const { User } = require("../models");

module.exports = () => {
  passport.serializeUser((user, done) => {
    // user === exUser
    done(null, user.id); //user.id만 추출
  });
  // 세션 {14141515131232: 1} {세션쿠키: 유저아이디} -> 메모리 저장 (나중에 많아져서 유저아이디만 저장)

  passport.deserializeUser((id, done) => {
    //id:1
    User.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: ["id", "nick"],
          as: "Followers",
        }, //팔로잉
        {
          model: User,
          attributes: ["id", "nick"],
          as: "Followings",
        }, //팔로워
      ],
    })
      .then((user) => done(null, user)) //req.user, req.session
      .catch((err) => done(err));
  });

  local();
  kakao();
};
