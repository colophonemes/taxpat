import { Typography } from '@material-ui/core'
import React from 'react'
import HR from '../components/HR'
import Page from '../components/Page'
import TaxCalculator from '../components/TaxCalculator'

type HomePageProps = {}

const HomePage: React.FC<HomePageProps> = ({}) => {
  return (
    <Page title="TaxPat – tax calculator for expats">
      <Typography variant="h1">TaxPat</Typography>
      <Typography variant="h5" component="h2">
        The tax calculator for expats
      </Typography>
      <HR />
      <TaxCalculator />
    </Page>
  )
}

export default HomePage
