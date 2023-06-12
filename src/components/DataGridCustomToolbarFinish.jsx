import React from 'react';
import { Search } from '@mui/icons-material';
import { IconButton, TextField, InputAdornment, Box } from '@mui/material';
import {
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarColumnsButton,
} from '@mui/x-data-grid';
import FlexBetween from './FlexBetween';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';

const DataGridCustomToolbar = ({
  searchInput,
  setSearchInput,
  setSearch,
  handleOpenModal,
}) => {
  return (
    <GridToolbarContainer>
      <FlexBetween width='100%'>
        <FlexBetween>
          <GridToolbarColumnsButton />
          <GridToolbarDensitySelector />
        </FlexBetween>
        <FlexBetween>
          <Box
            display='flex'
            alignItems='center'
            padding='0.5rem'
            borderRadius='0.5rem'
            color='#979797'
          >
            <h1 style={{ margin: 0 }}>Terminé</h1>
            <DoneOutlineIcon color='success' />
          </Box>
        </FlexBetween>
        <TextField
          label='Recherche...'
          sx={{ mb: '0.5rem', width: '15rem' }}
          onChange={(e) => setSearchInput(e.target.value)}
          value={searchInput}
          variant='standard'
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  onClick={() => {
                    setSearch(searchInput);
                    setSearchInput('');
                  }}
                >
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </FlexBetween>
    </GridToolbarContainer>
  );
};

export default DataGridCustomToolbar;
