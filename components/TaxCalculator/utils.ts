import { Interval, DateTime } from 'luxon'
import { FiscalYear, TaxYear } from './types'
import fiscalYears from '../../lib/fiscal_years.json'
import { getAllISOCodes } from 'iso-country-currency'

export function isValidTaxYear(TaxYear: Partial<TaxYear>): TaxYear is TaxYear {
  return (
    typeof TaxYear.taxableIncome === 'number' &&
    TaxYear.taxableIncome > 0 &&
    typeof TaxYear.countryCode === 'string' &&
    TaxYear.countryCode.length === 2 &&
    typeof TaxYear.currencyCode === 'string' &&
    TaxYear.currencyCode.length === 3 &&
    TaxYear.interval instanceof Interval
  )
}

export const DEFAULT_FISCAL_YEAR: FiscalYear = {
  day: 1,
  month: 1,
}

export function getFiscalYear(countryCode?: string): FiscalYear {
  if (!countryCode) return DEFAULT_FISCAL_YEAR
  return (
    fiscalYears.find((fiscalYear) => fiscalYear.countryCode === countryCode) ||
    DEFAULT_FISCAL_YEAR
  )
}

export const COUNTRIES = getAllISOCodes().sort((a, b) =>
  a.countryName.localeCompare(b.countryName)
)

export const DEFAULT_LOCALE =
  typeof window !== 'undefined' ? navigator.language : 'en-US'

export function getMonthsForLocale(locale = DEFAULT_LOCALE): string[] {
  const format = new Intl.DateTimeFormat(locale, { month: 'long' })
  const months = []
  for (let month = 0; month < 12; month++) {
    const testDate = new Date(Date.UTC(2000, month, 1, 0, 0, 0))
    months.push(format.format(testDate))
  }
  return months
}

export const MONTHS = getMonthsForLocale()

export function getYears(): string[] {
  const dates = Interval.fromDateTimes(
    DateTime.now().minus({ years: 20 }),
    DateTime.now().plus({ years: 1 })
  )
  const years = dates
    .splitBy({ years: 1 })
    .map((dt) => dt.start.toFormat('yyyy'))
  console.log(years)
  return years
}

export const YEARS = getYears()
