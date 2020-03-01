// 引入config
const cdn = require('../app.config.js').cdn

const path = require('path')

const fs = require('fs')

// 引入七牛云sdk
const qiniu = require('qiniu')

const {
  ak,
  sk,
  bucket
} = cdn

const mac = new qiniu.auth.digest.Mac(ak, sk)

const config = new qiniu.conf.Config()
config.zone = qiniu.zone.Zone_z2

const doUpload = (key, file) => {
  const options = {
    scope: bucket + ':' + key
  }
  const formUploader = new qiniu.form_up.FormUploader(config)
  const putExtra = new qiniu.form_up.PutExtra()
  const putPlicy = new qiniu.rs.PutPolicy(options)
  const uploaderToken = putPlicy.uploadToken(mac)
  return new Promise((resove, reject) => {
    formUploader.putFile(uploaderToken, key, file, putExtra, (err, body, info) => {
      // console.log(file,key)
      if (err) {
        return reject(err)
      }
      if (info.statusCode === 200) {
        resove(body)
      } else {
        reject(info)
      }
    })
  })
}

// 首先要读取dist目录下面的所有文件 暂时先测试client目录下面的文件

const files = fs.readdirSync(path.join(__dirname, '../dist'))

const uploads = files.map(file => {
  return doUpload(file, path.join(__dirname, '../dist', file))
})

Promise.all(uploads).then(res => {
  console.log('upload success', res)
}).catch(err => {
  console.log('upload failed ', err)
  process.exit(0)
})
