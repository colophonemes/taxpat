import {
  Button,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@material-ui/core'
import { Cancel, Restore } from '@material-ui/icons'
import { Currency } from 'iso-country-currency'
import React, { useEffect, useState } from 'react'
import HR from '../HR'
import { TaxYear, FiscalYear } from './types'
import {
  COUNTRIES,
  getFiscalYear,
  isValidTaxYear,
  MONTHS,
  YEARS,
} from './utils'
import FuzzySearch from '../Search'
import NumericInput from '../NumericInput'
import { DateTime, Interval } from 'luxon'

type TaxYearEditorProps = {
  TaxYear?: TaxYear
  onSave: (TaxYear: TaxYear) => void
}

const TaxYearEditor: React.FC<TaxYearEditorProps> = ({ TaxYear, onSave }) => {
  const [country, setCountry] = useState<Currency | undefined>()
  const [fiscalYear, setFiscalYear] = useState<FiscalYear | undefined>()
  const [year, setYear] = useState<number | undefined>()
  const [taxableIncome, setTaxableIncome] = useState<number | undefined>()
  const [taxPaid, setTaxPaid] = useState<number | undefined>()

  const TaxYearUnsaved: Partial<TaxYear> = {
    id: getId(),
    taxableIncome,
    taxPaid: taxPaid || 0,
    countryCode: country?.iso,
    currencyCode: country?.currency,
    interval: getInterval(),
  }

  console.log(TaxYearUnsaved)

  function getId(): string | undefined {
    const parts = [country?.iso, year, fiscalYear?.month, fiscalYear?.day]
    if (parts.some((part) => !part)) return
    return parts.join('-')
  }

  function getInterval(): Interval | undefined {
    if (!year || !fiscalYear) return
    const { month, day } = fiscalYear
    const start = DateTime.fromObject({ year, month, day })
    const end = start.plus({ year: 1 })
    return Interval.fromDateTimes(start, end)
  }

  function handleSelectCountry(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const iso = event.target.value
    const country = COUNTRIES.find((country) => country.iso === iso)
    setCountry(country)
  }

  function handleSetFiscalYearDay(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    let formattedValue: number
    if (/^\d+$/.test(value)) {
      formattedValue = parseInt(value, 10)
    }
    if (value === '' || (formattedValue >= 1 && formattedValue <= 31)) {
      setFiscalYear((state) => ({ ...state, day: formattedValue }))
    }
  }

  function handleSetFiscalYearMonth(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const value = (event.target.value as unknown) as number
    setFiscalYear((state) => ({ ...state, month: value }))
  }

  function handleResetFiscalYear() {
    setFiscalYear(getFiscalYear(country?.iso))
  }

  function handleSetYear(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    setYear(parseInt(value))
  }

  function handleSetTaxableIncome(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    let formattedValue: number
    if (/^\d+?$/.test(value)) {
      formattedValue = parseInt(value, 10)
    }
    if (value === '' || formattedValue >= 1) {
      setTaxableIncome(formattedValue)
    }
  }

  function handleSetTaxPaid(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    let formattedValue: number
    if (/^\d+?$/.test(value)) {
      formattedValue = parseInt(value, 10)
    }
    if (value === '' || formattedValue >= 1) {
      setTaxPaid(formattedValue)
    }
  }

  function handleSave() {
    onSave(TaxYear)
  }

  useEffect(() => {
    setFiscalYear(getFiscalYear(country?.iso))
  }, [country?.iso])

  return (
    <>
      <Grid container spacing={2} justify="center">
        <Grid item xs={12}>
          <Typography variant="h6" component="div">
            Country
          </Typography>
          {country ? (
            <>
              <Typography>
                {country.countryName}
                <IconButton onClick={() => setCountry(undefined)}>
                  <Cancel />
                </IconButton>
              </Typography>
            </>
          ) : (
            <FuzzySearch
              autoFocus
              fullWidth
              label="Country"
              placeholder="Search for a country..."
              list={COUNTRIES}
              formatResults={(country) => country.countryName}
              onSelectItem={(result) => setCountry(result)}
              keyBy="countryName"
              options={{ keys: ['countryName', 'iso'] }}
            />
          )}
        </Grid>
        {country && (
          <>
            <Grid item xs={12}>
              <Typography variant="h6" component="div">
                Fiscal year
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <TextField
                    label="Start day"
                    fullWidth
                    value={fiscalYear?.day || ''}
                    onChange={handleSetFiscalYearDay}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Start month"
                    select
                    fullWidth
                    onChange={handleSetFiscalYearMonth}
                    value={fiscalYear?.month || ''}
                  >
                    {MONTHS.map((month, i) => (
                      <MenuItem key={month} value={i + 1}>
                        {month}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="Year"
                    select
                    fullWidth
                    onChange={handleSetYear}
                    value={year || ''}
                  >
                    {YEARS.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={2}>
                  <IconButton onClick={handleResetFiscalYear}>
                    <Restore />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
        {country && year && (
          <>
            <Grid item md={6}>
              <Typography variant="h6" component="div">
                Taxable Income
              </Typography>
              <TextField
                fullWidth
                value={taxableIncome || ''}
                onChange={handleSetTaxableIncome}
                InputProps={{
                  inputComponent: NumericInput as any,
                  startAdornment: (
                    <InputAdornment position="start">
                      {country?.symbol || ' '}
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item md={6}>
              <Typography variant="h6" component="div">
                Tax paid
              </Typography>
              <TextField
                fullWidth
                value={taxPaid || ''}
                onChange={handleSetTaxPaid}
                InputProps={{
                  inputComponent: NumericInput as any,
                  startAdornment: (
                    <InputAdornment position="start">
                      {country?.symbol || ' '}
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item md={6}>
              <Button fullWidth variant="outlined" onClick={handleSave}>
                Add Tax Year
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </>
  )
}

export default TaxYearEditor
