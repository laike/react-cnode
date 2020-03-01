// 这部分是测试ap部分
import React from 'react'
import Axios from 'axios' // eslint-disable-line

export default class ApiTest extends React.Component {
  componentDidMount() {}

  getTopics() {
    Axios.get('/api/topics?limit=10&mrender=false')
      .then(resp => {
        console.log(resp)
      })
      .catch(err => console.log(err))
  }

  login() {
    Axios.post('/api/user/login', {
      accesstoken: 'd2669952-46d8-4f64-8dd7-0e6ddfce63ba'
    })
      .then(resp => {
        console.log(resp)
      })
      .catch(err => console.log(err))
  }

  markAll() {
    Axios.post('/api/message/mark_all?needAccessToken=true')
      .then(resp => {
        console.log(resp)
      })
      .catch(err => console.log(err))
  }

  render() {
    return (
      <div>
        <button type="button" onClick={this.getTopics}>
          topic
        </button>
        <button type="button" onClick={this.login}>
          login
        </button>
        <button type="button" onClick={this.markAll}>
          markAll
        </button>
      </div>
    )
  }
}
