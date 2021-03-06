const router = require('express').Router()
const axios = require('axios')
const baseUrl = 'https://cnodejs.org/api/v1'

router.post('/login', (req, res) => {
  axios.post(`${baseUrl}/accesstoken`, {
    accesstoken: req.body.accesstoken
  }).then(resp => {
    if (resp.status === 200 && resp.data.success) {
      req.session.user = {
        accessToken: req.body.accesstoken,
        loginName: resp.data.loginname,
        id: resp.data.id,
        avatarUrl: resp.data.avatar_url
      }
      res.json({
        sucess: true,
        data: resp.data
      })
    }
  })
    .catch(err => {
      if (err.response) {
        res.json(err.response.data)
      }
    })
})

module.exports = router
