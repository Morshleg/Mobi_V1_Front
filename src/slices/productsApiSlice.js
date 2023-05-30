import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const PRODUCTS_URL = '/api/products';

export const productsApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '' }),
  reducerPath: 'productApi',
  tagTypes: ['Product'],
  endpoints: (build) => ({
    getAllProducts: build.query({
      query: () => `${PRODUCTS_URL}`,
      method: 'GET',
    }),

    getProduct: build.query({
      query: (id) => `${PRODUCTS_URL}/${id}`,
      method: 'GET',
    }),

    createProduct: build.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/create`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),

    updateProduct: build.mutation({
      query: (id) => ({
        url: `${PRODUCTS_URL}/${id}`,
        method: 'PUT',
      }),
      providesTags: (id) => [{ type: 'Product', id }],
    }),

    deleteProduct: build.mutation({
      query: (id) => ({
        url: `${PRODUCTS_URL}/${id}`,
        method: 'DELETE',
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
} = productsApiSlice;
