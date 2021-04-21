import { createMuiTheme } from '@material-ui/core/styles'
import { CSSProperties } from '@material-ui/styles'

type HeadingStyles = {
  h1: CSSProperties
  h2: CSSProperties
  h3: CSSProperties
  h4: CSSProperties
  h5: CSSProperties
  h6: CSSProperties
}

export function getHeadingStyles(headingStyle: CSSProperties): HeadingStyles {
  return Object.fromEntries(
    [...Array(6)].map((_, i) => [`h${i + 1}`, headingStyle])
  ) as HeadingStyles
}

const fontStack = ['"Josefin Sans"', 'Helvetica', 'Arial', 'sans-serif'].join(
  ', '
)

const theme = createMuiTheme({
  typography: {
    fontFamily: fontStack,
    fontWeightBold: 700,
    fontWeightLight: 300,
    fontWeightRegular: 300,
    ...getHeadingStyles({
      fontWeight: 700,
    }),
  },
})

export default theme
