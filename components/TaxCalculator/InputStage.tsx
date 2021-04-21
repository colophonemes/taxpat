import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  makeStyles,
  MenuItem,
  TextField,
  Typography,
} from '@material-ui/core'
import { Cancel, ChevronRight, Delete, Restore } from '@material-ui/icons'
import { getAllISOCodes, Currency } from 'iso-country-currency'
import React, { useEffect, useState } from 'react'
import HR from '../HR'
import { useTaxCalculator } from './context'
import { StageComponentProps, Stage, TaxYear, FiscalYear } from './types'
import { getFiscalYear, isValidTaxYear, MONTHS, YEARS } from './utils'
import FuzzySearch from '../Search'
import NumberFormat from 'react-number-format'
import TaxYearEditor from './TaxYearEditor'

const useStyles = makeStyles((theme) => ({
  dialog: {
    minHeight: 400,
  },
}))

type InputStageProps = StageComponentProps

const InputStage: React.FC<InputStageProps> = ({ setStage }) => {
  const classes = useStyles()
  const [showAddTaxYearDialog, setShowAddTaxYearDialog] = useState(false)
  const { TaxYears } = useTaxCalculator()

  function handleSave(TaxYear: TaxYear) {
    console.log('Saved', TaxYear)
  }

  return (
    <>
      <Typography variant="h2">Tax years:</Typography>

      <Button onClick={() => setShowAddTaxYearDialog(true)}>
        Add tax year
      </Button>
      <HR />

      <Button
        onClick={() => setStage(Stage.Result)}
        disabled={!TaxYears.length}
      >
        Calculate <ChevronRight />
      </Button>

      <Dialog
        open={showAddTaxYearDialog}
        onClose={() => setShowAddTaxYearDialog(false)}
        className={classes.dialog}
      >
        <DialogTitle>Add a tax year</DialogTitle>
        <DialogContent>
          <TaxYearEditor onSave={handleSave} />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default InputStage
