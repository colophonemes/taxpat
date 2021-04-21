import { Interval } from 'luxon'

export enum Stage {
  Input = 'INPUT',
  Result = 'RESULT',
}

export type TaxYear = {
  id: string
  countryCode: string
  currencyCode: string
  taxableIncome: number
  taxPaid: number
  interval: Interval
}

export type StageComponentProps = {
  setStage: (stage: Stage) => void
}

export type FiscalYear = {
  countryCode?: string
  day: number
  month: number
}
