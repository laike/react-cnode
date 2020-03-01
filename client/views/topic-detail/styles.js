export const ReplyStyle = theme => ({
  root: {
    display: 'flex',
    backgroundColor: theme.palette.accept[50],
    marginBottom: 2
  },
  avatar: {
    padding: 10
  },
  info: {
    display: 'flex',
    flexDirection: 'column'
  },
  title: { fontSize: 12 },
  content: {
    textAlign: 'left'
  }
})


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
})
