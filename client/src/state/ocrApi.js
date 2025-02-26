import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ocrApi = createApi({
  reducerPath: 'ocrApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    extractText: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append('image', file);
        return {
          url: '/ocr',
          method: 'POST',
          body: formData,
        };
      },
    }),
  }),
});

export const { useExtractTextMutation } = ocrApi;