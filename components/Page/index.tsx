import { Container, Grid } from '@material-ui/core'
import Head from 'next/head'
import React from 'react'

type PageProps = {
  title: string
  variant?: 'narrow' | 'regular' | 'wide' | 'full'
}

const Page: React.FC<PageProps> = ({
  title,
  children,
  variant = 'regular',
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="content">
        {variant === 'full' ? (
          children
        ) : (
          <Container fixed>
            {variant === 'wide' ? (
              children
            ) : (
              <Grid container justify="center">
                {variant === 'regular' ? (
                  <Grid item sm={10} md={9} lg={8}>
                    {children}
                  </Grid>
                ) : (
                  <Grid item sm={8} md={8} lg={6}>
                    {children}
                  </Grid>
                )}
              </Grid>
            )}
          </Container>
        )}
      </div>
    </>
  )
}

export default Page
