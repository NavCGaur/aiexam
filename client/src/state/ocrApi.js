import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ocrApi = createApi({
  reducerPath: 'ocrApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_BASE_URL }),
  endpoints: (builder) => ({
    extractText: builder.mutation({
      query: (formData) => ({
        url: 'api/ocr',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const { useExtractTextMutation } = ocrApi;
