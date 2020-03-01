export const infoStyels = theme => ({
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
  infoBox: {
    flexGrow: 1,
    width: '100%',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.secondary,
  }

})
