import { Button } from '@material-ui/core'
import { ChevronLeft } from '@material-ui/icons'
import React from 'react'
import { Stage, StageComponentProps } from './types'

type ResultsStageProps = StageComponentProps

const ResultsStage: React.FC<ResultsStageProps> = ({ setStage }) => {
  return (
    <>
      ResultsStage
      <Button onClick={() => setStage(Stage.Input)}>
        <ChevronLeft /> Edit Tax Years
      </Button>
    </>
  )
}

export default ResultsStage
