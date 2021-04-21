import { TextFieldProps } from '@material-ui/core'
import Fuse from 'fuse.js'
import React, { useEffect, useState } from 'react'

import SearchBase from './SearchBase'

type FuzzySearchProps<T> = {
  list: T[]
  options: Fuse.IFuseOptions<T>
  onSelectItem: (
    item: Fuse.FuseResult<T>['item'],
    result?: Fuse.FuseResult<T>
  ) => void
  formatResults: (
    item: Fuse.FuseResult<T>['item'],
    result?: Fuse.FuseResult<T>
  ) => React.ReactNode
  keyBy: string
  maxResults?: number
}

function FuzzySearch<T>({
  list,
  options,
  onSelectItem,
  formatResults,
  keyBy,
  maxResults = 5,
  ...textFieldProps
}: FuzzySearchProps<T> & Omit<TextFieldProps, 'results'>): JSX.Element {
  const [search, setSearch] = useState('')
  const [fuse, setFuse] = useState(new Fuse<T>(list, options))
  const results = fuse.search(search).slice(0, maxResults)

  /** Update fuse if the props change. Mostly useful in development */
  useEffect(() => {
    setFuse(new Fuse<T>(list, options))
  }, [list, options])

  return (
    <>
      <SearchBase
        search={search}
        results={results}
        keyBy={`item.${keyBy}`}
        maxResults={maxResults}
        formatResults={(result) => formatResults(result.item, result)}
        onSearchChange={(search) => setSearch(search)}
        onSelectItem={(result) => onSelectItem(result.item, result)}
        {...textFieldProps}
      />
    </>
  )
}

export default FuzzySearch
