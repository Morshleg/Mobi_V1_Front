import React from 'react';
import { Search } from '@mui/icons-material';
import { IconButton, TextField, InputAdornment } from '@mui/material';
import {
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
} from '@mui/x-data-grid';
import FlexBetween from './FlexBetween';
import { Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useSelector } from 'react-redux';

const DataGridCustomToolbar = ({
  searchInput,
  setSearchInput,
  setSearch,
  handleOpenModal,
}) => {
  const user = useSelector((state) => state.auth.userInfo);
  const userRole = user.Role;

  return (
    <GridToolbarContainer>
      <FlexBetween width='100%'>
        <FlexBetween>
          <GridToolbarColumnsButton />
          <GridToolbarDensitySelector />
          <GridToolbarFilterButton />
        </FlexBetween>
        {userRole === 'Empereur' && (
          <FlexBetween>
            <Button
              variant='contained'
              color='primary'
              onClick={handleOpenModal}
              sx={{ ml: 1, mr: 1 }}
              startIcon={<AddCircleOutlineIcon />}
            >
              Ajouter un produit
            </Button>
          </FlexBetween>
        )}

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
