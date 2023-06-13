import React from 'react';
import { Search } from '@mui/icons-material';
import {
  IconButton,
  TextField,
  InputAdornment,
  Box,
  useTheme,
  Typography,
} from '@mui/material';
import {
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarColumnsButton,
} from '@mui/x-data-grid';
import FlexBetween from './FlexBetween';

import LoopIcon from '@mui/icons-material/Loop';

const DataGridCustomToolbar = ({
  searchInput,
  setSearchInput,
  setSearch,
  handleOpenModal,
}) => {
  const theme = useTheme();
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
            <Typography
              variant='h3'
              color={theme.palette.secondary[100]}
              fontWeight='bold'
              marginRight={2}
            >
              En cours
            </Typography>
            <LoopIcon color='warning' />
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
