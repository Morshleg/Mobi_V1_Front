import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const PRODUCTS_URL = '/api/products';

export const productsApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '' }),
  reducerPath: 'productApi',
  tagTypes: ['Product'],
  endpoints: (build) => ({
    getAllProducts: build.query({
      query: () => `${PRODUCTS_URL}`,
      method: 'GET',
      credentials: 'include',
    }),

    getProduct: build.query({
      query: (id) => `${PRODUCTS_URL}/${id}`,
      method: 'GET',
      credentials: 'include',
    }),

    createProduct: build.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/create`,
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['Product'],
    }),

    updateProduct: build.mutation({
      query: ({ id, data }) => ({
        url: `${PRODUCTS_URL}/${id}`,
        method: 'PUT',
        body: data,
        credentials: 'include',
      }),
      providesTags: (id) => [{ type: 'Product', id }],
    }),

    deleteProduct: build.mutation({
      query: (id) => ({
        url: `${PRODUCTS_URL}/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      providesTags: (id) => [{ type: 'Product', id }],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
