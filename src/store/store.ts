import {
  Action,
  configureStore,
  ThunkAction,
  isRejectedWithValue,
  Middleware,
} from '@reduxjs/toolkit'

import { isLocalStorageAvailable } from 'libs/localstorage'
import citiesSlice, { hydrate, CitiesState } from './slices/cities.slice'
import { cityApiSlice } from './slices/cityApi.slice'

export const LS_KEY_NAME = 'weather-forecast'

const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    console.warn('Something went wrong')
  }
  return next(action)
}

const store = configureStore({
  reducer: {
    cities: citiesSlice,
    [cityApiSlice.reducerPath]: cityApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cityApiSlice.middleware, rtkQueryErrorLogger),
})

// Localstorage

if (isLocalStorageAvailable()) {
  store.subscribe(() => {
    localStorage.setItem(LS_KEY_NAME, JSON.stringify(store.getState()))
  })

  const getCitiesFromLocalStorage = (): CitiesState | undefined => {
    try {
      const persistedState = localStorage.getItem(LS_KEY_NAME)
      if (persistedState) {
        const state: RootState = JSON.parse(persistedState)
        return state.cities
      }
    } catch (e) {
      console.log(e)
    }
  }
  const cities = getCitiesFromLocalStorage()

  if (cities) {
    store.dispatch(hydrate(cities))
  }
}

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
export default store
