const { follow } = require("../services/user");

exports.follow = async (req, res, next) => {
  //req.user.id, req.params.id를 알수 있다

  try {
    const result = await follow(req.user.id, req.params.id);
    //혹시나 찾는데이터가 없으면 안전장치
    if (result === "ok") {
      //컨트롤러는 응답과 요청만 처리 핵심로직은 서비스가 처리
      await user.addFollowing(parseInt(req.params.id, 10));
      res.send("success");
    } else if (result === "no user") {
      res.status(404).send("no user");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};
