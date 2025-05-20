import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://private-9d65b3-tinnova.apiary-mock.com/' }),
  endpoints: (builder) => ({
    getUsersList: builder.query({
      query: (name) => `users`,
    }),
  }),
})

export const { useGetUsersListQuery } = usersApi