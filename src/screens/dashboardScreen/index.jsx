
import React, { useState, useEffect } from "react";

import {
  Box,
  useTheme,
  useMediaQuery,
  
} from "@mui/material";

import { DataGrid, frFR } from "@mui/x-data-grid";
import {
  useGetAllRepairsQuery
} from "api/repairsApi";
import StatBox from "components/StatBox";
import { IoMdMailUnread, IoMdPartlySunny, IoMdRainy } from "react-icons/io";
import { VscFilePdf } from "react-icons/vsc";
import DataGridCustomToolbarFinish from "components/DataGridCustomToolbarFinish";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DataGridCustomToolbarInProgress from "components/DataGridCustomToolbarInProgress";


// site API: https://data.regionreunion.com/api/explore/v2.0/console

const DashboardScreen = ({headerName}) => {


  /* MUTATION */

 
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  /*------------ MUTATION ------------------*/
  const { data, isLoading } = useGetAllRepairsQuery({
    page,
    pageSize,
    sort: JSON.stringify(sort),
    search,
  });

 
  const [repairsFinished, setRepairsFinished] = useState([]);
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const [repairsInProgress, setRepairsInProgress] = useState([]);
  
  const theme = useTheme();

  useEffect(() => {
    if (data) {
      const inProgress = data.filter((repair) => repair.Etat !== "fin");
      const finished = data.filter((repair) => repair.Etat === "fin");
      setRepairsInProgress(inProgress);
      setRepairsFinished(finished);
    }
  }, [data]);


  const columnsArray1 = [
    {
      field: "NumRI",
      headerName: "Code RI",
      flex: 1,
    },
    {
      field: "Demandeur",
      headerName: "Demandeur",
      flex: 1,
    },
    {
      field: "Etat",
      headerName: "Etat",
      flex: 1,
    },
    
  ];

  const columnsArray2 = [
    {
      field: "NumRI",
      headerName: "Code RI",
      flex: 1,
    },
    {
      field: "Demandeur",
      headerName: "Demandeur",
      flex: 1,
    },
    {
      field: "Etat",
      headerName: "Etat",
      flex: 1,
    },
    {
      field: "Collaborateur",
      headerName: "Collaborateur",
      flex: 1,
    },
    {
      field: "Action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <div style={{ display: "flex" }}>
        
          <UploadFileIcon
            style={{ cursor: "pointer", marginRight: "0.5rem" }}
          />
          
        </div>
      ),
    },
  ];
  

  return (
    <Box m="1.5rem 2.5rem">
      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        {/* ROW 1 - METEOBOX*/}
        <StatBox
          title="Saint-Pierre"
          increase="22°"
          description="Pluvieux"
          icon={<IoMdRainy />}
          
        />
        <StatBox
          title="Saint-Paul"
          increase="25°"
          description="Nuageux"
          icon={<IoMdPartlySunny />}
          
          />
          
       
        <StatBox
          title="RI PDF"
         
          icon={<VscFilePdf />}
        
          />
          {/* ROW 1 */}
          <StatBox
          title="Messagerie"
          
          icon={<IoMdMailUnread />}
          />
      </Box>

      {/* ROW 2 PRODUCTS ARRAY */}
      <Box height="15vh">
</Box>

      {/* ROW 3 REPAIRS ARRAY */}
     <Box display="flex" justifyContent="space-between" height="55vh" >
        {/* TABLEAU 1 EN COURS */}
        <Box width="48%">
          <Box
            height="100%"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme.palette.background.alt,
                color: theme.palette.secondary[100],
                borderBottom: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: theme.palette.primary.light,
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: theme.palette.background.alt,
                color: theme.palette.secondary[100],
                borderTop: "none",
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: `${theme.palette.secondary[200]} !important`,
              },
            }}
          >
            <DataGrid
              localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
              loading={isLoading || !data}
              getRowId={(row) => row._id}
              rows={repairsInProgress}
              columns={columnsArray1}
              rowCount={(data && data.total) || 0}
              rowsPerPageOptions={[20, 50, 100]}
              pagination
              page={page}
              pageSize={pageSize}
              paginationMode="server"
              sortingMode="server"
              onPageChange={(newPage) => setPage(newPage)}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              onSortModelChange={(newSortModel) => setSort(...newSortModel)}
              components={{ Toolbar: DataGridCustomToolbarInProgress }}
              componentsProps={{
                toolbar: { searchInput, setSearchInput, setSearch },
              }}
            />
          </Box>
        </Box>

        {/* TABLEAU 2 TERMINE */}
        <Box width="48%">
          <Box
            height="100%"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme.palette.background.alt,
                color: theme.palette.secondary[100],
                borderBottom: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: theme.palette.primary.light,
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: theme.palette.background.alt,
                color: theme.palette.secondary[100],
                borderTop: "none",
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: `${theme.palette.secondary[200]} !important`,
              },
            }}
          >
            <DataGrid
              localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
              loading={isLoading || !data}
              getRowId={(row) => row._id}
              rows={repairsFinished}
              columns={columnsArray2}
              onSortModelChange={(newSortModel) => setSort(...newSortModel)}
              components={{ Toolbar: DataGridCustomToolbarFinish }}
              componentsProps={{
                toolbar: { searchInput, setSearchInput, setSearch },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardScreen;
