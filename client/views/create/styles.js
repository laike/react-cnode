
export const ContentStyle = theme => ({
  content: {
    lineHeight: '25px',
    '& img': {
      maxWidth: '100%'
    },
    '& a': {
      color: theme.palette.primary[30]
    },
  },
  mde: {
    position: 'relative',
    '& .CodeMirror': {
      height: '250px'
    },
  },
  iconHover: {
    position: 'absolute',
    bottom: 50,
    right: 30,
    zIndex: 9,
    '&:hover': {
      color: theme.palette.primary[800],
    },
  },
  radios: {
    position: 'absolute',
    left: 20,
    bottom: 50,
    zIndex: 9
  },
  fmcontainer: {
    width: '80%',
    margin: 20
  }
})
