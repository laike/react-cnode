const router = require("express").Router();
const axios = require("axios");
const baseUrl = "https://cnodejs.org/api/v1";

router.post("/login", (req, res) => {
  axios
    .post(`${baseUrl}/accesstoken`, {
      accesstoken: req.body.accesstoken,
    })
    .then(resp => {
      if (resp.status === 200 && resp.data.success) {
        req.session.user = {
          accessToken: req.body.accesstoken,
          loginName: resp.data.loginname,
          id: resp.data.id,
          avatarUrl: resp.data.avatar_url,
        };
        res.json({
          success: true,
          data: resp.data,
        });
      }
    })
    .catch(err => {
      if (err.response) {
        res.json(err.response.data);
      }
    });
});
router.get("/", (req, res) => {
  const path = req.path;
  const query = Object.assign({}, req.query);
  axios(`${baseUrl}${path}`, {
    method: req.method,
    params: query,
    data: queryString.stringify(Object.assign({}, req.body)),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then(resp => {
      if (resp.status === 200) {
        res.send(resp.data);
      } else {
        res.status(resp.status).send(resp.data);
      }
    })
    .catch(err => {
      if (err.response) {
        res.status(500).send(err.response.data);
      } else {
        res.status(500).send({
          success: false,
          msg: "未知错误",
        });
        next(err);
      }
    });
});

module.exports = router;
