import React from "react";
import { Search } from "@mui/icons-material";
import { IconButton, TextField, InputAdornment } from "@mui/material";
import {
  GridToolbarDensitySelector,
  GridToolbarContainer, 
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid";
import FlexBetween from "./FlexBetween";



const DataGridCustomToolbar = ({ searchInput, setSearchInput, setSearch, handleOpenModal }) => {
  return (
    <GridToolbarContainer>
      <FlexBetween width="100%">
      <FlexBetween>
          <GridToolbarColumnsButton />
          <GridToolbarDensitySelector />
          
          <GridToolbarFilterButton />
          </FlexBetween>
          
        <TextField
          label="Recherche..."
          sx={{ mb: "0.5rem", width: "15rem" }}
          onChange={(e) => setSearchInput(e.target.value)}
          value={searchInput}
          variant="standard"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    setSearch(searchInput);
                    setSearchInput("");
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
