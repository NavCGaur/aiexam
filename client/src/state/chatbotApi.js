import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chatbotApi = createApi({
  reducerPath: "chatbotApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_BASE_URL }),
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (message) => ({
        url: "api/chatbot",
        method: "POST",
        body: { message }, // Input can be a category name or free text
      }),
    }),
  }),
});

export const { useSendMessageMutation } = chatbotApi;
