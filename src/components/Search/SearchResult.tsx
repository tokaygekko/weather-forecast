import React, { FC } from 'react'

import { City, isOpenWeatherErrorType } from 'store'
import { SearchResultItem } from 'components/SearchResultItem'
import { Spinner } from 'components/Spinner'
import { useKeyboardNavigation } from './hooks'
import './SearchResult.scss'

interface SearchResultProps {
  error: unknown
  cityName: string | undefined
  added: number[]
  isError: boolean
  isFetching: boolean
  isEmpty: boolean
  result: City[] | undefined
  onSelect: (id: number) => void
}

export const SearchResult: FC<SearchResultProps> = ({
  error,
  cityName,
  added,
  isError,
  isFetching,
  isEmpty,
  result,
  onSelect,
}) => {
  const [activeCursor] = useKeyboardNavigation(result ? result.length : 0)

  return (
    <div className="SearchResult">
      <div className="SearchResult_container">
        {isError ? (
          <span className="SearchResult_text">
            <span className="SearchResult_textTitle">Something went wrong</span>
            <span className="SearchResult_textDescription">
              {isOpenWeatherErrorType(error) && error.data
                ? `${error.data.message}`
                : 'Try to check connection'}
            </span>
          </span>
        ) : (
          <>
            {isEmpty && (
              <span className="SearchResult_text">
                <span className="SearchResult_textTitle">
                  City called &laquo;{cityName}&raquo; was not found
                </span>
                <span className="SearchResult_textDescription">
                  Try different city name
                </span>
              </span>
            )}
            {isFetching ? (
              <Spinner />
            ) : (
              <>
                {result && (
                  <ul className="SearchResult_list">
                    {result.map((city: City, index) => (
                      <SearchResultItem
                        key={city.id}
                        city={city}
                        index={index}
                        disabled={added.includes(city.id)}
                        activeCursor={activeCursor}
                        onSelect={onSelect}
                      />
                    ))}
                  </ul>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
