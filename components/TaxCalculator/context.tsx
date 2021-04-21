import produce, { Draft } from 'immer'
import React, { createContext, useContext, useState } from 'react'
import { TaxYear } from './types'

type TaxCalculatorState = {
  readonly TaxYears: Partial<TaxYear>[]
}

type TaxCalculatorMethods = {
  addTaxYear: (TaxYear: TaxYear) => void
  removeTaxYear: (index) => void
}

type TaxCalculatorContext = TaxCalculatorState & TaxCalculatorMethods

const TaxCalculatorContext = createContext<TaxCalculatorContext>({
  TaxYears: [],
  addTaxYear: () => undefined,
  removeTaxYear: () => undefined,
})

const { Provider } = TaxCalculatorContext

function getInitialState(): TaxCalculatorState {
  return {
    TaxYears: [],
  }
}

function addTaxYear(state: TaxCalculatorState, TaxYear: TaxYear) {
  return produce(state, (draft: Draft<TaxCalculatorState>) => {
    draft.TaxYears.push(TaxYear)
  })
}

function removeTaxYear(state: TaxCalculatorState, index: number) {
  return produce(state, (draft: Draft<TaxCalculatorState>) => {
    draft.TaxYears.splice(index, 1)
  })
}

type TaxCalculatorProviderProps = {}

const TaxCalculatorProvider: React.FC<TaxCalculatorProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState<TaxCalculatorState>(getInitialState())

  function handleAddTaxYear(TaxYear: TaxYear) {
    setState((state) => addTaxYear(state, TaxYear))
  }

  function handleRemoveTaxYear(index: number) {
    setState((state) => removeTaxYear(state, index))
  }

  const value = {
    ...state,
    addTaxYear: handleAddTaxYear,
    removeTaxYear: handleRemoveTaxYear,
  }

  return <Provider value={value}>{children}</Provider>
}

export const useTaxCalculator = () => useContext(TaxCalculatorContext)

export default TaxCalculatorProvider
