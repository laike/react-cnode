export const loginStyels = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 70,
    margin: 24,
  },
  bg: {
    width: '100%',
    height: 500,
    backgroundImage: `linear-gradient(45deg,  ${theme.palette.accept[200]} 30%, ${theme.palette.primary[200]} 100%);`,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  loginBox: {
    width: 500,
    margin: '20px 0'
  },
  loginTxt: {
    width: '100%',
    margin: '15px 0'
  },
  error: {
    color: 'red',
    lineHeight: '25px',
    fontSize: 12
  },
  loginBtn: {
    width: '100%',
  }
})
