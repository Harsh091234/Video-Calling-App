import { baseApi } from "./baseApi";

const demoApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        sendName: builder.mutation<any, string>({
            query: (name) => ({
                url: "/demo/send",
                method: "POST",
                body: {name}
            })
        }),
        
    })
})

export const {useSendNameMutation} = demoApi;