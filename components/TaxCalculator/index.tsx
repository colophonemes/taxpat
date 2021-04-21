import React, { useState } from 'react'
import TaxCalculatorProvider from './context'
import InputStage from './InputStage'
import ResultsStage from './ResultsStage'
import { Stage, StageComponentProps } from './types'

type TaxCalculatorProps = {}

function getStageComponent(
  stage: Stage
): React.ComponentType<StageComponentProps> {
  switch (stage) {
    case Stage.Input:
      return InputStage
    case Stage.Result:
      return ResultsStage

    default:
      throw new Error(`Invalid stage ${stage}`)
  }
}

const TaxCalculator: React.FC<TaxCalculatorProps> = ({}) => {
  const [stage, setStage] = useState<Stage>(Stage.Input)

  const Component = getStageComponent(stage)
  return (
    <TaxCalculatorProvider>
      <Component setStage={setStage} />
    </TaxCalculatorProvider>
  )
}

export default TaxCalculator
