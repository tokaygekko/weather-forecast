import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { City, OpenWeatherResponse } from 'api/types'

export const cityApiSlice = createApi({
  reducerPath: 'cityApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.openweathermap.org/data/2.5',
  }),
  endpoints: (build) => ({
    fetchCitiesByName: build.query({
      query: (cityName) => ({
        url: '/find',
        method: 'GET',
        params: {
          q: cityName,
          appid: `${process.env.REACT_APP_OPEN_WEATHER_API_KEY}`,
          units: 'metric',
        },
      }),
      transformResponse: (response: OpenWeatherResponse): City[] =>
        response.list,
    }),
  }),
})