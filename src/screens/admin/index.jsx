import React, { useState, useEffect } from 'react';
import 'index.css';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Grid,
  useTheme,
} from '@mui/material';
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useGetUserByIdMutation,
  useRegisterMutation,
} from 'slices/usersApiSlice';
import { DataGrid, frFR } from '@mui/x-data-grid';
import DataGridCustomToolbarAdmin from 'components/DataGridCustomToolbarAdmin';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import Header from 'components/Header';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import InfoIcon from '@mui/icons-material/Info';
import { Formik } from 'formik';
import * as yup from 'yup';

const registerSchema = yup.object().shape({
  FirstName: yup.string().required('required'),
  LastName: yup.string().required('required'),
  Pseudo: yup.string().required('required'),
  Email: yup.string().email('invalid email').required('required'),
  Password: yup.string().required('required'),
  Role: yup
    .string()
    .required("Le rôle de l'utilisateur est requis")
    .oneOf(
      ['Lecteur', 'Reparateur', 'Vendeur', 'Empereur'],
      "Le rôle n'est pas valide'"
    )
    .default('Lecteur'),
});

const initialValuesRegister = {
  FirstName: '',
  LastName: '',
  Pseudo: '',
  Password: '',
  Email: '',
  Role: 'Lecteur',
};

const Admin = () => {
  const theme = useTheme();
  const [sort, setSort] = useState({});
  const [filteredData, setData] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const { data, isLoading, refetch } = useGetAllUsersQuery({
    sort: JSON.stringify(sort),
    search: searchInput,
  });

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });
  const [getUserById] = useGetUserByIdMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [addUser] = useRegisterMutation();
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (data) {
      const filtered = data.filter((repair) =>
        Object.values(repair).some((value) =>
          String(value).toLowerCase().includes(searchInput.toLowerCase())
        )
      );
      setData(filtered || []);
    }
  }, [data, searchInput, setData, selectedUser, setSelectedUser]);

  /* ------------------------------------ USER CREATE-------------------------------------------------*/
  const [RegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [RegistermodalText, setRegisterModalText] = useState('');

  const openRegisterModal = (text) => {
    setRegisterModalText(text);
    setRegisterModalOpen(true);
  };

  const handleFormSubmit = async (formData, onSubmitProps) => {
    try {
      const response = await addUser(formData);
      const savedUser = response.data;
      if (savedUser) {
        onSubmitProps.resetForm();
        openRegisterModal('Utilisateur correctement enregistré');
        refetch();
      } else {
        console.error("Erreur lors de l'enregistrement de l'utilisateur");
      }
    } catch (error) {}
  };

  /* ------------------------------------ USER UPDATE -------------------------------------------------*/

  const [editMode, setEditMode] = useState(false);
  const [LastName, setNewLastName] = useState('');
  const [FirstName, setNewFirstName] = useState('');
  const [Pseudo, setNewPseudo] = useState('');
  const [Email, setNewEmail] = useState('');
  const [Role, setNewRole] = useState('');

  const [UpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [UpdatemodalText, setUpdateModalText] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const openModal = (text) => {
    setUpdateModalText(text);
    setUpdateModalOpen(true);
  };

  const handleEditField = () => {
    setEditMode(true);
  };

  const isValidEmail = (email) => {
    // Expression régulière pour vérifier le format de l'e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSaveField = async () => {
    if (selectedUser && selectedUser._id && editMode) {
      // Vérification de l'e-mail ici avant de sauvegarder les modifications
      if (Email !== '' && !isValidEmail(Email)) {
        return;
      }
      const updateData = {
        LastName: LastName !== '' ? LastName : selectedUser.LastName,
        FirstName: FirstName !== '' ? FirstName : selectedUser.FirstName,
        Pseudo: Pseudo !== '' ? Pseudo : selectedUser.Pseudo,
        Email: Email !== '' ? Email : selectedUser.Email,
        Role: Role !== '' ? Role : selectedUser.Role,
      };
      try {
        const response = await fetch(`/api/users/${selectedUser._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });

        if (!response.ok) {
          throw new Error('Failed to update user.');
        }
        openModal('Utilisateur correctement modifié');
        refetch();
        setData(filteredData || []);
        setEditMode(false);
        setUpdateSuccess(true);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setNewLastName(selectedUser.LastName);
    setNewFirstName(selectedUser.FirstName);
    setNewPseudo(selectedUser.Pseudo);
    setNewEmail(selectedUser.Email);
    setNewRole(selectedUser.Role);
  };

  /* ------------------------------------ USER READ -------------------------------------------------*/

  const handleInfo = async (user) => {
    try {
      const response = await getUserById(user._id);
      setSelectedUser(response.data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations de l'utilisateur :",
        error
      );
    }
  };

  /* ------------------------------------ USER DELETE -------------------------------------------------*/
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] =
    useState(false);

  const deleteConfirmationOpenModal = () => {
    setDeleteConfirmationModalOpen(true);
  };

  const deleteConfirmationCloseModal = () => {
    setDeleteConfirmationModalOpen(false);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    deleteConfirmationOpenModal();
  };

  const handleDeleteUser = async (user) => {
    try {
      await deleteUser(user._id);
      deleteConfirmationCloseModal();
      refetch();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur :", error);
    }
  };

  /* ------------------------------------ ARRAY COLUMNS -------------------------------------------------*/

  const columns = [
    {
      field: 'FirstName',
      headerName: 'Prénom',
      flex: 0.5,
    },
    {
      field: 'LastName',
      headerName: 'Nom',
      flex: 0.5,
    },
    {
      field: 'Pseudo',
      headerName: 'Pseudo',
      flex: 0.5,
    },
    {
      field: 'Email',
      headerName: 'Email',
      flex: 0.5,
    },
    {
      field: 'Role',
      headerName: 'Rôle',
      flex: 0.5,
    },
    {
      field: 'repair',
      headerName: 'Réparation',
      flex: 0.5,
    },
    {
      field: 'Action',
      headerName: 'Action',
      flex: 1,
      renderCell: (params) => (
        <div style={{ display: 'flex' }}>
          <DeleteForeverOutlinedIcon
            color='error'
            fontSize='large'
            onClick={handleDelete}
            style={{ cursor: 'pointer', marginRight: '2rem' }}
          />

          <InfoIcon
            color='warning'
            fontSize='large'
            onClick={() => handleInfo(params.row)}
            style={{ cursor: 'pointer', marginRight: '2rem' }}
          />
          {deleteConfirmationModalOpen && (
            <div>
              <DoneIcon
                color='success'
                onClick={() => handleDeleteUser(params.row)}
                style={{ cursor: 'pointer', marginLeft: '0.5rem' }}
              />

              <ClearIcon
                color='error'
                onClick={deleteConfirmationCloseModal}
                style={{ cursor: 'pointer', marginLeft: '0.5rem' }}
              />
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <Box m='1.5rem 2.5rem'>
      <Header title='ADMININISTRATION' subtitle='Gestion des utilisateurs' />
      <Box display='flex' justifyContent='center' height='30vh'>
        <Box
          width='20%'
          display='flex'
          flexDirection='column'
          alignItems='center'
          marginRight='20%'
          marginTop='30px'
          marginBottom='10px'
          borderRadius='15%'
          fontWeight='bold'
        >
          {/* ------------------------------------ PROFILE BOX -------------------------------------------------*/}

          {selectedUser && (
            <Box textAlign='center'>
              {editMode ? (
                <>
                  <p>
                    <span
                      style={{
                        textDecoration: 'underline',
                        fontWeight: 'bold',
                        color: 'gray',
                      }}
                    >
                      Prénom
                    </span>{' '}
                    :{' '}
                    <input
                      type='text'
                      defaultValue={selectedUser.FirstName}
                      onChange={(e) => setNewFirstName(e.target.value)}
                    />
                  </p>
                  <p>
                    <span
                      style={{
                        textDecoration: 'underline',
                        fontWeight: 'bold',
                        color: 'gray',
                      }}
                    >
                      Nom
                    </span>{' '}
                    :{' '}
                    <input
                      type='text'
                      defaultValue={selectedUser.LastName}
                      onChange={(e) => setNewLastName(e.target.value)}
                    />
                  </p>
                  <p>
                    <span
                      style={{
                        textDecoration: 'underline',
                        fontWeight: 'bold',
                        color: 'gray',
                      }}
                    >
                      Pseudo
                    </span>{' '}
                    :{' '}
                    <input
                      type='text'
                      defaultValue={selectedUser.Pseudo}
                      onChange={(e) => setNewPseudo(e.target.value)}
                    />
                  </p>

                  <p>
                    <span
                      style={{
                        textDecoration: 'underline',
                        fontWeight: 'bold',
                        color: 'gray',
                      }}
                    >
                      Email
                    </span>{' '}
                    :{' '}
                    <input
                      type='text'
                      defaultValue={selectedUser.Email}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                    {editMode && Email !== '' && !isValidEmail(Email) && (
                      <div style={{ color: 'red', marginTop: '0.5rem' }}>
                        L'adresse e-mail n'est pas au format mail@mail.com
                      </div>
                    )}
                  </p>
                  <p>
                    <span
                      style={{
                        textDecoration: 'underline',
                        fontWeight: 'bold',
                        color: 'gray',
                      }}
                    >
                      Rôle
                    </span>{' '}
                    :{' '}
                    <select
                      defaultValue={selectedUser.Role}
                      onChange={(e) => setNewRole(e.target.value)}
                    >
                      <option value='Lecteur'>Lecteur</option>
                      <option value='Reparateur'>Reparateur</option>
                      <option value='Vendeur'>Vendeur</option>
                      <option value='Empereur'>Empereur</option>
                    </select>
                  </p>
                  <DoneIcon
                    color='success'
                    onClick={handleSaveField}
                    style={{ cursor: 'pointer', marginLeft: '0.5rem' }}
                  />
                  <ClearIcon
                    color='error'
                    onClick={handleCancelEdit}
                    style={{ cursor: 'pointer', marginLeft: '0.5rem' }}
                  />
                </>
              ) : (
                <>
                  <p>
                    <span
                      style={{
                        textDecoration: 'underline',
                        fontWeight: 'bold',
                        color: 'gray',
                      }}
                    >
                      Prénom
                    </span>{' '}
                    : <span>{updateSuccess ? '' : selectedUser.FirstName}</span>
                  </p>
                  <p>
                    <span
                      style={{
                        textDecoration: 'underline',
                        fontWeight: 'bold',
                        color: 'gray',
                      }}
                    >
                      Nom
                    </span>{' '}
                    : <span>{updateSuccess ? '' : selectedUser.LastName}</span>
                  </p>
                  <p>
                    <span
                      style={{
                        textDecoration: 'underline',
                        fontWeight: 'bold',
                        color: 'gray',
                      }}
                    >
                      Pseudo
                    </span>{' '}
                    : <span>{updateSuccess ? '' : selectedUser.Pseudo}</span>
                  </p>
                  <p>
                    <span
                      style={{
                        textDecoration: 'underline',
                        fontWeight: 'bold',
                        color: 'gray',
                      }}
                    >
                      Email
                    </span>{' '}
                    : <span>{updateSuccess ? '' : selectedUser.Email}</span>
                  </p>
                  <p>
                    <span
                      style={{
                        textDecoration: 'underline',
                        fontWeight: 'bold',
                        color: 'gray',
                      }}
                    >
                      Rôle
                    </span>{' '}
                    : <span>{updateSuccess ? '' : selectedUser.Role}</span>
                  </p>
                  <EditIcon
                    color='primary'
                    onClick={handleEditField}
                    style={{ cursor: 'pointer', marginLeft: '0.5rem' }}
                  />
                  {UpdateModalOpen && (
                    <div
                      style={{ fontWeight: 'normal', color: '#66bb6a' }}
                      className='updateFade-out'
                    >
                      {UpdatemodalText}
                    </div>
                  )}
                </>
              )}
            </Box>
          )}
        </Box>

        {/* ------------------------------------ FORM BOX -------------------------------------------------*/}

        <Box
          width='45%'
          m='1.5rem 2.5rem'
          display='flex'
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
        >
          <Formik
            initialValues={initialValuesRegister}
            validationSchema={registerSchema}
            onSubmit={handleFormSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label='Prénom'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.FirstName}
                      required
                      name='FirstName'
                      error={
                        Boolean(touched.FirstName) && Boolean(errors.FirstName)
                      }
                      helperText={touched.FirstName && errors.FirstName}
                      sx={{ marginBottom: 2 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label='Nom'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.LastName}
                      required
                      name='LastName'
                      error={
                        Boolean(touched.LastName) && Boolean(errors.LastName)
                      }
                      helperText={touched.LastName && errors.LastName}
                      sx={{ marginBottom: 2 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label='Pseudo'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.Pseudo}
                      required
                      name='Pseudo'
                      error={Boolean(touched.Pseudo) && Boolean(errors.Pseudo)}
                      helperText={touched.Pseudo && errors.Pseudo}
                      sx={{ marginBottom: 2 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label='Email'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.Email}
                      required
                      name='Email'
                      error={Boolean(touched.Email) && Boolean(errors.Email)}
                      helperText={touched.Email && errors.Email}
                      sx={{ marginBottom: 2 }}
                      autoComplete='off'
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label='Password'
                      type='Password'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.Password}
                      required
                      name='Password'
                      error={
                        Boolean(touched.Password) && Boolean(errors.Password)
                      }
                      helperText={touched.Password && errors.Password}
                      sx={{ marginBottom: 2 }}
                      autoComplete='new-password'
                      readOnly
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      select
                      label='Role'
                      name='Role'
                      required
                      value={values.Role}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.Role && Boolean(errors.Role)}
                      helperText={touched.Role && errors.Role}
                      sx={{ marginBottom: 2 }}
                    >
                      <MenuItem value='Lecteur'>Lecteur</MenuItem>
                      <MenuItem value='Reparateur'>Reparateur</MenuItem>
                      <MenuItem value='Vendeur'>Vendeur</MenuItem>
                      <MenuItem value='Empereur'>Empereur</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <Button type='submit' variant='contained' color='primary'>
                      Ajouter
                    </Button>
                    {RegisterModalOpen && (
                      <div
                        style={{ fontWeight: 'normal', color: '#66bb6a' }}
                        className='fade-out'
                      >
                        {RegistermodalText}
                      </div>
                    )}
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </Box>
      </Box>

      {/* ------------------------------------ ARRAY BOX -------------------------------------------------*/}

      <Box display='flex' justifyContent='center' width='100%' height='100%'>
        <Box width='100%'>
          <Box
            height='100%'
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
            {isLoading || !data ? (
              <CircularProgress /> // Indicateur de chargement
            ) : (
              <DataGrid
                localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
                loading={isLoading || !data}
                getRowId={(row) => row._id}
                rows={filteredData}
                columns={columns}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                onSortModelChange={(newSortModel) => setSort(...newSortModel)}
                components={{
                  Toolbar: DataGridCustomToolbarAdmin,
                }}
                componentsProps={{
                  toolbar: { searchInput, setSearchInput },
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default Admin;
