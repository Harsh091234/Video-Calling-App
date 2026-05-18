import { peer } from "../../config/peer"
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react"

export const peerApi = createApi({
  reducerPath: "peerApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    createOffer: builder.mutation({
      async queryFn() {
        const offer = await peer.createOffer()
        await peer.setLocalDescription(offer)
        return { data: offer }
      },
    }),

    createAnswer: builder.mutation({
      async queryFn(offer) {
        await peer.setRemoteDescription(offer)

        const answer = await peer.createAnswer()
        await peer.setLocalDescription(answer)

        return { data: answer }
      },    
    }),

    setRemoteAnswer: builder.mutation({
      async queryFn(ans) {
          await peer.setRemoteDescription(ans)
          return { data: "ok" }
      },
    }),

    
  }),
})

export const {
  useCreateOfferMutation,
  useCreateAnswerMutation,
  useSetRemoteAnswerMutation,
  
} = peerApi
