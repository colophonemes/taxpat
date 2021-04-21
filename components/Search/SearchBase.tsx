import {
  CircularProgress,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  TextField,
  TextFieldProps,
  Typography,
} from '@material-ui/core'
import { Close } from '@material-ui/icons'
import SearchIcon from '@material-ui/icons/Search'
import classnames from 'classnames'
import get from 'lodash/get'
import React, { useCallback, useEffect, useRef, useState } from 'react'

const GLOBAL_HOTKEY_KEYCODE = '/'

const useStyles = makeStyles((theme) => ({
  resultsListWrapper: { position: 'relative' },
  resultsList: {
    position: 'absolute',
    backgroundColor: '#FFF',
    zIndex: 2000,
    border: `1px solid ${theme.palette.grey[300]}`,
    borderTop: 'none',
    width: 'auto',
    [theme.breakpoints.only('xs')]: {
      maxWidth: '90vw',
    },
    maxWidth: 'max(40vw, 100%)',
    maxHeight: '90vh',
    overflowY: 'scroll',
    overflowX: 'hidden',
    boxShadow: `0 0px 2px ${theme.palette.grey[600]}`,
  },
  resultsItem: {
    maxWidth: '100%',
    '&:not(:last-of-type)': {
      borderBottom: `1px solid ${theme.palette.grey[400]}`,
    },
    '&.selected': {
      backgroundColor: theme.palette.primary.light,
      '& .MuiTypography-root': {
        fontWeight: 700,
      },
    },
  },
  resultsItemText: {
    maxWidth: '100%',
    '& .MuiTypography-root': {
      maxWidth: '100%',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      // If we have a text-only search result, we can pre-space
      // it so bold text doesn't cause layout shift
      '&.bold-pre-spacedx': {
        display: 'inline-flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-between',
        '&::after': {
          content: 'attr(data-text)',
          height: 0,
          visibility: 'hidden',
          overflow: 'hidden',
          userSelect: 'none',
          pointerEvents: 'none',
          fontWeight: 700,
          '@media speech': {
            display: 'none',
          },
        },
      },
    },
  },
  inputAdornmentEnd: {
    width: 54,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
}))

export type SearchProps<T extends Record<string | number, unknown>> = {
  onSearchChange: (value: string) => void
  search: string
  results: T[] | undefined
  onSelectItem: (item: T) => void
  formatResults: (item: T) => React.ReactNode
  keyBy: string
  loading?: boolean
  maxResults?: number
  useGlobalHotkey?: boolean
} & Omit<TextFieldProps, 'results'>

export function SearchBase<T extends Record<string | number, unknown>>({
  onSearchChange,
  results,
  search,
  onSelectItem,
  formatResults,
  keyBy,
  maxResults = 5,
  loading = false,
  useGlobalHotkey = false,
  ...textFieldProps
}: SearchProps<T>): JSX.Element {
  const classes = useStyles()
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectedResultIndex(0)
    onSearchChange(event.target.value)
  }

  function handleSelect(item: T) {
    onSelectItem(item)
    if (results) {
      setSelectedResultIndex(
        results.findIndex((result) => get(result, keyBy) === get(item, keyBy))
      )
    } else {
      setSelectedResultIndex(-1)
    }
    inputRef.current?.blur()
  }

  function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault()
        if (!results) return
        setSelectedResultIndex((index) =>
          index > 0 ? index - 1 : Math.min(results.length, maxResults) - 1
        )
        break
      case 'ArrowDown':
        event.preventDefault()
        if (!results) return
        setSelectedResultIndex((index) =>
          index < Math.min(results.length, maxResults) - 1 ? index + 1 : 0
        )
        break
      case 'Enter':
        event.preventDefault()
        if (!results) return
        if (results.length && selectedResultIndex > -1)
          handleSelect(results[selectedResultIndex])
        break
      default:
      // do nothing
    }
  }

  function handleFocus() {
    setIsFocused(true)
  }

  function handleBlur() {
    setTimeout(() => setIsFocused(false), 100)
  }

  function handleClear() {
    setFocused()
    onSearchChange('')
  }

  function setFocused() {
    inputRef.current?.focus()
    setTimeout(() => setIsFocused(true), 100)
  }

  /** If we get a new result set, select the first item */
  useEffect(() => {
    if (results?.length) {
      setSelectedResultIndex(0)
    }
  }, [results?.length])

  /**
   * Event listener for keypress events, to check if global hotkey has been
   * pressed
   */
  const handleGlobalHotkey = useCallback(function (
    this: Document,
    event: KeyboardEvent
  ) {
    /**
     * Check that the currently-focused element isn't a text input element
     * (otherwise we can't type the hotkey into any text fields, including the
     * search box itself)
     */
    const disallowedElement =
      event.target instanceof Element &&
      ['INPUT', 'TEXTAREA'].includes(event.target.nodeName)
    if (event.key === GLOBAL_HOTKEY_KEYCODE && !disallowedElement) {
      setFocused()
      event.preventDefault()
    }
  },
  [])

  /** Create global hotkey if required */
  useEffect(() => {
    if (typeof document === 'undefined' || !useGlobalHotkey) return
    document.addEventListener('keypress', handleGlobalHotkey)
    return () => {
      document.removeEventListener('keypress', handleGlobalHotkey)
    }
  }, [handleGlobalHotkey, useGlobalHotkey])

  return (
    <>
      <TextField
        value={search}
        onChange={handleSearchChange}
        onKeyDown={handleKeyPress}
        variant="standard"
        InputProps={{
          endAdornment: (
            <InputAdornment
              position="end"
              className={classes.inputAdornmentEnd}
            >
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                search && (
                  <IconButton size="small" onClick={handleClear}>
                    <Close />
                  </IconButton>
                )
              )}
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        inputRef={inputRef}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Search..."
        {...textFieldProps}
      />
      {!!results?.length && isFocused && (
        <div className={classes.resultsListWrapper}>
          <List className={classes.resultsList} disablePadding>
            {results.slice(0, maxResults).map((result, index) => {
              const formattedResult = formatResults(result)
              const key = get(result, keyBy)
              if (typeof key !== 'string')
                throw new Error(
                  `keyBy must refer to a property in result that is of type string (keyBy is ${keyBy})`
                )
              return (
                <ListItem
                  key={key}
                  className={classnames(classes.resultsItem, {
                    selected: index === selectedResultIndex,
                  })}
                  button
                  onClick={() => handleSelect(result)}
                >
                  <ListItemText
                    className={classes.resultsItemText}
                    disableTypography={true}
                  >
                    <Typography
                      component="div"
                      data-text={
                        typeof formattedResult === 'string'
                          ? formattedResult
                          : undefined
                      }
                      className={classnames({
                        'bold-pre-spaced': typeof formattedResult === 'string',
                      })}
                    >
                      {formattedResult}
                    </Typography>
                  </ListItemText>
                </ListItem>
              )
            })}
          </List>
        </div>
      )}
    </>
  )
}

export default SearchBase
