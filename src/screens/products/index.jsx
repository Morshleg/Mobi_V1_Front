import React from 'react';
import { Box, useTheme } from '@mui/material';
import { DataGrid, frFR } from '@mui/x-data-grid';
import { useGetAllProductsQuery } from 'slices/productsApiSlice';

const Products = () => {
  const theme = useTheme();
  const { data, isLoading } = useGetAllProductsQuery();
  console.log(data);
  const columns = [
    {
      field: 'Code article',
      headerName: 'Code article',
      flex: 1,
    },
    {
      field: 'Designation',
      headerName: 'Designation',
      flex: 1,
    },
    {
      field: 'Taille',
      headerName: 'Taille',
      flex: 1,
      valueFormatter: (params) => {
        if (params.value === null) {
          return ''; // Retourne une chaîne vide si la valeur est null
        }
        return `${params.value} GO`;
      },
    },
    {
      field: 'Couleur',
      headerName: 'Couleur',
      flex: 1,
    },
    {
      field: 'Rayon',
      headerName: 'Rayon',
      flex: 1,
    },
    {
      field: 'PointDeVente',
      headerName: 'Point de vente',
      flex: 1,
    },
  ];

  return (
    <Box m='1.5rem 2.5rem'>
      <Box
        mt='40px'
        height='75vh'
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: 'none',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: theme.palette.primary.light,
          },
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: 'none',
          },
          '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={data || []}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default Products;
