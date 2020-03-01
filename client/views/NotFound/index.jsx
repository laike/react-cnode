import React from 'react'
import PropTypes from 'prop-types'

export default class NotFound extends React.Component {
  constructor() {
    super()
    // const { staticContext } = this.props;
    // staticContext.NOT_FOUND = true;
    // console.log(this.props)
    this.a = 1
  }

  render() {
    return (<div>
      sorry not found page!
            </div>)
  }
}

NotFound.propTypes = {
  // staticContext: PropTypes.object.isRequired
}
