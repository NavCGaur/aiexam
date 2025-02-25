import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const paperApi = createApi({
  reducerPath: 'paperApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_BASE_URL }),
  endpoints: (builder) => ({
    generatePaper: builder.mutation({
      query: (paperDetails) => ({
        url: 'api/papers/generate',
        method: 'POST',
        body: paperDetails,
      }),
    }),
    generatePaper3: builder.mutation({
      query: (paperDetails) => ({
        url: 'api/papers/generate3',
        method: 'POST',
        body: paperDetails,
      }),
    }),
    generatePaperBilingual: builder.mutation({
      query: (paperDetails) => ({
        url: 'api/papers/generate-bilingual',
        method: 'POST',
        body: paperDetails,
      }),
    }),
    fetchQuestionSummary: builder.query({
      query: () => '/api/questions/summary', 
    }),
    validatePaperId: builder.query({
      query: (paperId) => `api/papers/validate/${paperId}`, // New endpoint for validation
    }),
    initiatePayment: builder.mutation({
      query: (paymentDetails) => ({
        url: 'api/payments/create-order',
        method: 'POST',
        body: paymentDetails,
      }),
    }),
    updatePaymentStatus: builder.mutation({
      query: (statusDetails) => ({
        url: 'api/payments/update-payment',
        method: 'POST',
        body: statusDetails,
      }),
    }),
    verifyPayment: builder.query({
      query: (orderId) => `api/payments/update-payment/${orderId}`,
    }),
    fetchEduData: builder.query({
      query: () => '/api/education/data',
    }),
  }),
});

export const {
  useGeneratePaperMutation,
  useGeneratePaper3Mutation,
  useGeneratePaperBilingualMutation,
  useFetchQuestionSummaryQuery,
  useValidatePaperIdQuery,
  useInitiatePaymentMutation,
  useVerifyPaymentQuery,
  useUpdatePaymentStatusMutation,
  useFetchEduDataQuery,
} = paperApi;
