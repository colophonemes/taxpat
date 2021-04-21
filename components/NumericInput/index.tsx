import React from 'react'
import NumberFormat from 'react-number-format'

interface NumericInputProps {
  inputRef: (instance: NumberFormat | null) => void
  onChange: (event: { target: { name: string; value: string } }) => void
  name: string
}

function NumericInput(props: NumericInputProps) {
  const { inputRef, onChange, ...rest } = props

  return (
    <NumberFormat
      {...rest}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        })
      }}
      thousandSeparator
      isNumericString
    />
  )
}

export default NumericInput
