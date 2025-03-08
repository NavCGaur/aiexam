import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const speechApi = createApi({
  reducerPath: 'speechApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_BASE_URL }),
  endpoints: (builder) => ({
    transcribeAudio: builder.mutation({
      query: (formData) => ({
        url: 'api/speech/transcribe',
        method: 'POST',
        body: formData,
   
      }),
    }),
  }),
});

export const { useTranscribeAudioMutation } = speechApi;