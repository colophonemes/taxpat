import { makeStyles, Theme } from '@material-ui/core'
import React from 'react'

type HRProps = {
  verticalSpacing?: number
}

const useStyles = makeStyles<Theme, { verticalSpacing: number }>((theme) => ({
  root: ({ verticalSpacing }) => ({
    marginTop: theme.spacing(verticalSpacing),
    marginBottom: theme.spacing(verticalSpacing),
    border: 'none',
    borderTop: `1px solid ${theme.palette.grey[400]}`,
  }),
}))

const HR: React.FC<HRProps> = ({ verticalSpacing = 3 }) => {
  const classes = useStyles({ verticalSpacing })
  return <hr className={classes.root} />
}

export default HR
