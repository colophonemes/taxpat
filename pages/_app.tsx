import Head from 'next/head'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import theme from '../globals/theme'
import { CssBaseline, ThemeProvider } from '@material-ui/core'

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  // Remove the server-side injected CSS.
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles?.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <>
      <Head>
        <title>TaxPat – Tax Calculator for Expats</title>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,300;0,700;1,300;1,700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Component />
      </ThemeProvider>
    </>
  )
}

export default MyApp
