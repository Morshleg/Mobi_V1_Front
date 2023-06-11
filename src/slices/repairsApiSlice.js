import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const REPAIRS_URL = '/api/repairs';

export const repairsApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '' }),
  reducerPath: 'repairApi',
  tagTypes: ['Repair'],
  endpoints: (build) => ({
    
    getAllRepairs: build.query({
      query: () => `${REPAIRS_URL}`,
      method: 'GET',
    }),

    getRepair: build.mutation({
      query: (id) => ({
        url: `${REPAIRS_URL}/${id}`,
        method: 'GET'
      }),
    }),

    

    createRepair: build.mutation({
      query: (data) => ({
        url: `${REPAIRS_URL}/create`,
        method: 'POST',
        body: data,
      }),
    }),

    updateRepair: build.mutation({
      query: (id) => ({
        url: `${REPAIRS_URL}/${id}`,
        method: 'PUT',
      }),
      
    }),

    deleteRepair: build.mutation({
      query: (id) => ({
        url: `${REPAIRS_URL}/${id}`,
        method: 'DELETE',
      }),
      
    }),
  }),
});

export const {
  useGetAllRepairsQuery,
  useGetRepairMutation,
  useCreateRepairMutation,
  useUpdateRepairMutation,
  useDeleteRepairMutation,
} = repairsApiSlice;
