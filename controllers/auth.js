const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");

exports.join = async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.redirect("/join?error=exist");
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

exports.login = (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      //서버실패
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      //로직실패
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      //로그인 성공
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect("/");
    });
  })(req, res, next);
};

exports.logout = (req, res, next) => {
  //{} 브라우저 connect.sid가 남아있어도
  req.logout(() => {
    res.redirect("/");
  });
};
