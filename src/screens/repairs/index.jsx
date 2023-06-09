import React, { useState, useEffect } from 'react';
import {
  Box,
  useTheme,
  Button,
  TextField,
  MenuItem,
  Grid,
} from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import { DataGrid, frFR } from '@mui/x-data-grid';
import {
  useCreateRepairMutation,
  useGetAllRepairsQuery,
  useDeleteRepairMutation,
  useGetRepairMutation,
} from 'api/repairsApi';

import DataGridCustomToolbarInProgress from 'components/DataGridCustomToolbarInProgress';
import DataGridCustomToolbarFinish from 'components/DataGridCustomToolbarFinish';
//import { styled } from "@mui/system";
import Header from 'components/Header';
//import AutoStoriesIcon from "@mui/icons-material/AutoStories"; //icone d'info a utiliser plus tard
import DeleteIcon from '@mui/icons-material/Delete';
import SyncIcon from '@mui/icons-material/Sync';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import ReportPDF from 'components/ReportPDF';
import { PDFDownloadLink } from '@react-pdf/renderer';

/*----------------------------STEP BAR----------------------------------*/

// const StepBar = styled(Box)(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "space-between",
//   marginBottom: theme.spacing(2),
// }));

// const StepIndicator = styled(Box)(({ theme, isasctive, iscompleted }) => ({
//   width: theme.spacing(2),
//   height: theme.spacing(2),
//   borderRadius: "50%",
//   backgroundColor: iscompleted ? "green" : isactive ? "yellow" : "red",
//   marginRight: theme.spacing(1),
// }));

// const StepLabel = styled(Box)(({ theme }) => ({
//   fontWeight: "bold",
// }));

/*-------------------------FORM REPAIR-------------------------------------*/

const registerSchema = yup.object().shape({
  /* Reception */
  Demandeur: yup
    .string()
    .required('Veuillez choisir un demandeur')
    .oneOf([
      'Bureau Vallée Reunion NORD',
      'Bureau Vallée Reunion SUD',
      'MobiOne',
    ])
    .default('MobiOne'),
  NumDoss: yup.number().required('required'),
  Modele: yup.string().required('required'),
  Couleur: yup.string().required('required'),
  NumSerieRec: yup.number().required('required'),
  NumSerieExp: yup.number().required('required'),
  Accessoires: yup
    .string()
    .required('Selectionner un accessoire')
    .oneOf([
      'Boite',
      'Tête de charge',
      'Cable de charge',
      'Ecouteurs',
      'Aucun accessoires',
    ])
    .default('Aucun accessoires'),
  PanneClient: yup.string().required('required'),
  Remarque: yup.string(),

  /* Diagnostic */
  EtatProduit: yup.string().oneOf(['Oxydé', 'RAS', 'Cassé']).default('RAS'),
  PanneReparateur: yup.string(),

  /* Réparation */
  InterventionRealisee: yup.string(),
  Commentaire: yup.string(),

  /* Fin */
  Garantie: yup
    .string()
    .oneOf(['Garantie Constructeur', 'Hors Garantie'])
    .default('Garantie Constructeur'),
  MotifRejetGarantie: yup.string(),
  PanneDiagnostique: yup.string(),
  Etat: yup
    .string()
    .oneOf(['reception', 'diagnostic', 'reparation', 'fin'])
    .default('reception'),
});

const initialValuesRegister = {
  Demandeur: 'MobiOne',
  NumDoss: '',
  Modele: '',
  Couleur: '',
  NumSerieRec: '',
  NumSerieExp: '',
  Accessoires: 'Aucun accessoires',
  PanneClient: '',
  EtatProduit: 'RAS',
  Remarque: '',
  Garantie: 'Garantie Constructeur',
  MotifRejetGarantie: '',
  PanneDiagnostique: '',
  Commentaire: '',
  PanneReparateur: '',
  InterventionRealisee: '',
  Etat: 'reception',
};

/* COMPONENT */

const Transactions = () => {
  const theme = useTheme();
  // values to be sent to the backend
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  /*------------ MUTATION ------------------*/
  const { data, isLoading, refetch } = useGetAllRepairsQuery({
    page,
    pageSize,
    sort: JSON.stringify(sort),
    search,
  });
  const [addRepair] = useCreateRepairMutation();
  const [deleteRepair] = useDeleteRepairMutation();
  const [getRepair] = useGetRepairMutation();
  const [selectedRepair, setSelectedRepair] = useState(null);

  /* ------------------------ STATE ----------------------------*/
  const [repairsInProgress, setRepairsInProgress] = useState([]);
  const [repairsFinished, setRepairsFinished] = useState([]);

  const [currentRepairState, setCurrentRepairState] = useState({
    Etat: 'reception',
  });
  //const [showFields, setShowFields] = useState(false);

  /* Gestion affichage du formulaire */
  const [showForm, setShowForm] = useState(false);

  const handleButtonClick = () => {
    setShowForm(true);
  };

  /* ----------------------------------------------------------------------------------------*/
  useEffect(() => {
    if (data) {
      const inProgress = data.filter((repair) => repair.Etat !== 'fin');
      const finished = data.filter((repair) => repair.Etat === 'fin');
      setRepairsInProgress(inProgress);
      setRepairsFinished(finished);
    }
  }, [data]);

  /*
  const steps = [
    { label: "Réception" },
    { label: "Diagnostic" },
    { label: "Réparation" },
    { label: "Finalisé" },
  ]; */

  const [isSaved, setIsSaved] = useState(false);

  const handleCancel = () => {
    setShowForm(false); // Cacher le formulaire et afficher le bouton "Créer un rapport"
  };

  /*--------------------------- CREATE REPAIR --------------------------------------------------*/
  const [RegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [RegistermodalText, setRegisterModalText] = useState('');

  const openRegisterModal = (text) => {
    setRegisterModalText(text);
    setRegisterModalOpen(true);
  };

  const handleFormSubmit = async (values) => {
    try {
      const response = await addRepair(values);
      const savedRepair = response.data;
      if (savedRepair) {
        setIsSaved(true);
        openRegisterModal('Réparation correctement créée');
        refetch();
        setShowForm(false);
      } else {
        console.error(
          "Erreur lors de l'enregistrement du rapport d'intervention"
        );
      }
    } catch (error) {}
  };
  /*--------------------------- UPDATE REPAIR --------------------------------------------------*/
  const [EtatProduit, setNewEtatProduit] = useState('');
  const [PanneReparateur, setNewPanneReparateur] = useState('');
  const [InterventionRealisee, setNewInterventionRealisee] = useState('');
  const [Commentaire, setNewCommentaire] = useState('');
  const [Garantie, setNewGarantie] = useState('');
  const [MotifRejetGarantie, setNewMotifRejetGarantie] = useState('');
  const [PanneDiagnostique, setNewPanneDiagnostique] = useState('');
  const [Remarque, setNewRemarque] = useState('');

  const [UpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [UpdatemodalText, setUpdateModalText] = useState('');

  const openModal = (text) => {
    setUpdateModalText(text);
    setUpdateModalOpen(true);
  };

  const handleEditClick = async (repair) => {
    const etat = repair.Etat;

    try {
      const response = await getRepair(repair._id);
      setSelectedRepair(response.data);
      setCurrentRepairState(etat);
      //setShowFields(true);
      console.log(repair.Etat);
      console.log(repair._id);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur :", error);
    }
  };

  const handleUpdate = async () => {
    const updatedData = {
      EtatProduit:
        EtatProduit !== '' ? EtatProduit : selectedRepair.EtatProduit,
      PanneReparateur:
        PanneReparateur !== ''
          ? PanneReparateur
          : selectedRepair.PanneReparateur,
      InterventionRealisee:
        InterventionRealisee !== ''
          ? InterventionRealisee
          : selectedRepair.InterventionRealisee,
      Commentaire:
        Commentaire !== '' ? Commentaire : selectedRepair.Commentaire,
      Garantie: Garantie !== '' ? Garantie : selectedRepair.Garantie,
      MotifRejetGarantie:
        MotifRejetGarantie !== ''
          ? MotifRejetGarantie
          : selectedRepair.MotifRejetGarantie,
      PanneDiagnostique:
        PanneDiagnostique !== ''
          ? PanneDiagnostique
          : selectedRepair.PanneDiagnostique,
      Remarque: Remarque !== '' ? Remarque : selectedRepair.Remarque,
      Etat: getNextState(selectedRepair.Etat), // Utilisation d'une fonction pour déterminer l'état suivant
    };

    try {
      const response = await fetch(`/api/repairs/${selectedRepair._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de la réparation');
      }

      openModal('Réparation mise à jour avec succès');
      refetch();
      setShowForm(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la réparation :', error);
    }
  };

  const getNextState = (currentState) => {
    // Logique pour déterminer l'état suivant en fonction de l'état actuel
    switch (currentState) {
      case 'reception':
        return 'diagnostic';
      case 'diagnostic':
        return 'reparation';
      case 'reparation':
        return 'fin';
      default:
        return currentState;
    }
  };

  /*--------------------------- DELETE REPAIR --------------------------------------------------*/

  const handleDelete = async (repair) => {
    try {
      await deleteRepair(repair._id);
      refetch();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur :", error);
    }
  };
  /*--------------------------------------------------------------------------------------------*/
  const columnsArray1 = [
    {
      field: 'NumRI',
      headerName: 'Code RI',
      flex: 1,
    },
    {
      field: 'Demandeur',
      headerName: 'Demandeur',
      flex: 1,
    },
    {
      field: 'Etat',
      headerName: 'Etat',
      flex: 1,
    },
    {
      field: 'Action',
      headerName: 'Action',
      flex: 1,
      renderCell: (params) => (
        <div style={{ display: 'flex' }}>
          <DeleteIcon
            color='error'
            onClick={() => handleDelete(params.row)}
            style={{ cursor: 'pointer', marginRight: '2rem' }}
          />
          {/* <AutoStoriesIcon
            style={{ cursor: "pointer", marginRight: "0.5rem" }}
          /> */}
          <ModeEditIcon
            style={{ cursor: 'pointer', marginRight: '0.5rem' }}
            onClick={() => handleEditClick(params.row)}
          />
          <PDFDownloadLink
            document={<ReportPDF data={params.row} />}
            fileName='Rapport.pdf'
          >
            {({ loading }) =>
              loading ? (
                <SyncIcon />
              ) : (
                <UploadFileIcon
                  style={{
                    cursor: 'pointer',
                    marginRight: '0.5rem',
                    color: 'white',
                  }}
                />
              )
            }
          </PDFDownloadLink>
        </div>
      ),
    },
  ];

  const columnsArray2 = [
    {
      field: 'NumRI',
      headerName: 'Code RI',
      flex: 1,
    },
    {
      field: 'Demandeur',
      headerName: 'Demandeur',
      flex: 1,
    },
    {
      field: 'Etat',
      headerName: 'Etat',
      flex: 1,
    },
    {
      field: 'Action',
      headerName: 'Action',
      flex: 1,
      renderCell: (params) => (
        <div style={{ display: 'flex' }}>
          {/* <DeleteIcon
            color="error"
            onClick={handleDelete}
            style={{ cursor: "pointer", marginRight: "2rem" }}
          /> */}
          {/* <AutoStoriesIcon
            style={{ cursor: "pointer", marginRight: "0.5rem" }}
          /> */}
          {/* <ModeEditIcon style={{ cursor: "pointer", marginRight: "0.5rem" }} /> */}

          <PDFDownloadLink
            document={<ReportPDF data={params.row} />}
            fileName='Rapport.pdf'
          >
            {({ loading }) =>
              loading ? (
                <SyncIcon />
              ) : (
                <UploadFileIcon
                  style={{
                    cursor: 'pointer',
                    marginRight: '0.5rem',
                    color: 'white',
                  }}
                />
              )
            }
          </PDFDownloadLink>
        </div>
      ),
    },
  ];

  return (
    <Box m='1.5rem 2.5rem'>
      <Header
        title='REPARATIONS'
        subtitle="Liste des rapports d'interventions interne et externe"
      />
      {/* BOX STEPBAR */}
      {/*
      <Box display="flex" justifyContent="center" height="10vh">
        <StepBar style={{ width: "80%" }}>
          {steps.map((step, index) => (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              flex="1"
              justifyContent="center"
            >
              <StepIndicator
                isactive={step.isactive}
                iscompleted={step.iscompleted}
              />
              <StepLabel>{step.label}</StepLabel>
            </Box>
          ))}
        </StepBar>
      </Box>
          */}

      {/* BOX DU FORMULAIRE */}
      <Box display='flex' justifyContent='center' height='43vh'>
        <Box width='100%' p={2} textAlign='center'>
          <Box
            m='1.5rem 2.5rem'
            display='flex'
            flexDirection='column'
            alignItems='center'
          >
            <Formik
              initialValues={initialValuesRegister}
              validationSchema={registerSchema}
            >
              {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                resetForm,
              }) => (
                <form onSubmit={handleSubmit}>
                  {showForm && (
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          select
                          label='Demandeur'
                          name='Demandeur'
                          required
                          value={values.Demandeur}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.Demandeur && Boolean(errors.Demandeur)}
                          helperText={touched.Demandeur && errors.Demandeur}
                          sx={{ margin: 2 }}
                        >
                          <MenuItem value='Bureau Vallée Reunion NORD'>
                            Bureau Vallée Reunion NORD
                          </MenuItem>
                          <MenuItem value='Bureau Vallée Reunion SUD'>
                            Bureau Vallée Reunion SUD
                          </MenuItem>
                          <MenuItem value='MobiOne'>MobiOne</MenuItem>
                        </TextField>

                        <TextField
                          label='Numéro de Dossier'
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.NumDoss}
                          required
                          name='NumDoss'
                          error={
                            Boolean(touched.NumDoss) && Boolean(errors.NumDoss)
                          }
                          helperText={touched.NumDoss && errors.NumDoss}
                          sx={{ margin: 2 }}
                        />

                        <TextField
                          label='Modèle'
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.Modele}
                          required
                          name='Modele'
                          error={
                            Boolean(touched.Modele) && Boolean(errors.Modele)
                          }
                          helperText={touched.Modele && errors.Modele}
                          sx={{ margin: 2 }}
                        />

                        <TextField
                          label='Couleur'
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.Couleur}
                          required
                          name='Couleur'
                          error={
                            Boolean(touched.Couleur) && Boolean(errors.Couleur)
                          }
                          helperText={touched.Couleur && errors.Couleur}
                          sx={{ margin: 2 }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          label='Numéro de série receptionné'
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.NumSerieRec}
                          required
                          name='NumSerieRec'
                          error={
                            Boolean(touched.NumSerieRec) &&
                            Boolean(errors.NumSerieRec)
                          }
                          helperText={touched.NumSerieRec && errors.NumSerieRec}
                          sx={{ margin: 2 }}
                        />

                        <TextField
                          label='Numéro de série expédié'
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.NumSerieExp}
                          required
                          name='NumSerieExp'
                          error={
                            Boolean(touched.NumSerieExp) &&
                            Boolean(errors.NumSerieExp)
                          }
                          helperText={touched.NumSerieExp && errors.NumSerieExp}
                          sx={{ margin: 2 }}
                        />

                        <TextField
                          select
                          label='Accessoires'
                          name='Accessoires'
                          required
                          value={values.Accessoires}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.Accessoires && Boolean(errors.Accessoires)
                          }
                          helperText={touched.Accessoires && errors.Accessoires}
                          sx={{ margin: 2 }}
                        >
                          <MenuItem value='Boite'>Boite</MenuItem>
                          <MenuItem value='Tête de charge'>
                            Tête de charge
                          </MenuItem>
                          <MenuItem value='Cable de charge'>
                            Cable de charge
                          </MenuItem>
                          <MenuItem value='Ecouteurs'>Ecouteurs</MenuItem>
                          <MenuItem value='Aucun accessoires'>
                            Aucun accessoires
                          </MenuItem>
                        </TextField>

                        <TextField
                          label='Panne client'
                          type='PanneClient'
                          onBlur={handleBlur}
                          onChange={handleChange}
                          defaultValue=''
                          required
                          name='PanneClient'
                          error={
                            Boolean(touched.PanneClient) &&
                            Boolean(errors.PanneClient)
                          }
                          helperText={touched.PanneClient && errors.PanneClient}
                          sx={{ margin: 2 }}
                        />
                      </Grid>

                      {/* Affichez les boutons en fonction de l'état `isSaved` */}
                      <Grid item xs={12}>
                        {!isSaved ? (
                          <>
                            <Button
                              type='submit'
                              variant='contained'
                              color='primary'
                              onClick={() => handleFormSubmit(values)}
                              sx={{ margin: 1 }}
                            >
                              Enregistrer
                            </Button>
                            <Button
                              variant='contained'
                              color='secondary'
                              onClick={handleCancel}
                            >
                              Annuler
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant='contained'
                              color='secondary'
                              onClick={handleCancel}
                            >
                              Retourner à la création d'un RI
                            </Button>
                            <Button
                              type='submit'
                              variant='contained'
                              color='primary'
                            >
                              Passer à l'étape suivante
                            </Button>
                          </>
                        )}
                      </Grid>
                    </Grid>
                  )}

                  {!showForm && currentRepairState === 'reception' && (
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        {/* DIAGNOSTIC */}

                        <TextField
                          label='Panne réparateur'
                          type='PanneReparateur'
                          onBlur={handleBlur}
                          onChange={(e) =>
                            setNewPanneReparateur(e.target.value)
                          }
                          defaultValue={selectedRepair.PanneReparateur}
                          name='PanneReparateur'
                          error={
                            Boolean(touched.PanneReparateur) &&
                            Boolean(errors.PanneReparateur)
                          }
                          helperText={
                            touched.PanneReparateur && errors.PanneReparateur
                          }
                          sx={{ marginBottom: 2 }}
                        />
                        <TextField
                          select
                          label='Etat du produit'
                          name='EtatProduit'
                          defaultValue={selectedRepair.EtatProduit}
                          onChange={(e) => setNewEtatProduit(e.target.value)}
                          onBlur={handleBlur}
                          error={
                            touched.EtatProduit && Boolean(errors.EtatProduit)
                          }
                          helperText={touched.EtatProduit && errors.EtatProduit}
                          sx={{ marginBottom: 2 }}
                        >
                          <MenuItem value='Oxydé'>Oxydé</MenuItem>
                          <MenuItem value='RAS'>RAS</MenuItem>
                          <MenuItem value='Cassé'>Cassé</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid item xs={12}>
                        {!isSaved ? (
                          <>
                            <Button
                              type='submit'
                              variant='contained'
                              color='primary'
                              onClick={handleUpdate}
                            >
                              Enregistrer
                            </Button>
                            <Button
                              variant='contained'
                              color='secondary'
                              onClick={handleCancel}
                            >
                              Annuler
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant='contained'
                              color='secondary'
                              onClick={handleCancel}
                            >
                              Retourner à la création d'un RI
                            </Button>
                            <Button
                              type='submit'
                              variant='contained'
                              color='primary'
                            >
                              Passer à l'étape suivante
                            </Button>
                          </>
                        )}
                      </Grid>
                    </Grid>
                  )}
                  {!showForm && currentRepairState === 'diagnostic' && (
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        {/* REPARATION */}

                        <TextField
                          label='Intervention(s) réalisée(s)'
                          type='InterventionRealisee'
                          onBlur={handleBlur}
                          defaultValue={selectedRepair.InterventionRealisee}
                          onChange={(e) =>
                            setNewInterventionRealisee(e.target.value)
                          }
                          name='InterventionRealisee'
                          error={
                            Boolean(touched.InterventionRealisee) &&
                            Boolean(errors.InterventionRealisee)
                          }
                          helperText={
                            touched.InterventionRealisee &&
                            errors.InterventionRealisee
                          }
                          sx={{ marginBottom: 2 }}
                        />
                        <TextField
                          label='Commentaire'
                          type='Commentaire'
                          onBlur={handleBlur}
                          onChange={(e) => setNewCommentaire(e.target.value)}
                          defaultValue={selectedRepair.Commentaire}
                          name='Commentaire'
                          error={
                            Boolean(touched.Commentaire) &&
                            Boolean(errors.Commentaire)
                          }
                          helperText={touched.Commentaire && errors.Commentaire}
                          sx={{ marginBottom: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        {!isSaved ? (
                          <>
                            <Button
                              type='submit'
                              variant='contained'
                              color='primary'
                              onClick={handleUpdate}
                            >
                              Enregistrer
                            </Button>
                            <Button
                              variant='contained'
                              color='secondary'
                              onClick={handleCancel}
                            >
                              Annuler
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant='contained'
                              color='secondary'
                              onClick={handleCancel}
                            >
                              Retourner à la création d'un RI
                            </Button>
                            <Button
                              type='submit'
                              variant='contained'
                              color='primary'
                            >
                              Passer à l'étape suivante
                            </Button>
                          </>
                        )}
                      </Grid>
                    </Grid>
                  )}

                  {!showForm && currentRepairState === 'reparation' && (
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        {/* FIN */}
                        <TextField
                          select
                          label='Garantie'
                          name='Garantie'
                          onChange={(e) => setNewGarantie(e.target.value)}
                          defaultValue={selectedRepair.Garantie}
                          onBlur={handleBlur}
                          error={touched.Garantie && Boolean(errors.Garantie)}
                          helperText={touched.Garantie && errors.Garantie}
                          sx={{ marginBottom: 2 }}
                        >
                          <MenuItem value='Garantie Constructeur'>
                            Garantie Constructeur
                          </MenuItem>
                          <MenuItem value='Hors Garantie'>
                            Sans Garantie
                          </MenuItem>
                        </TextField>

                        <TextField
                          label='Motif de rejet de la garantie'
                          type='MotifRejetGarantie'
                          onBlur={handleBlur}
                          onChange={(e) =>
                            setNewMotifRejetGarantie(e.target.value)
                          }
                          defaultValue={selectedRepair.MotifRejetGarantie}
                          name='MotifRejetGarantie'
                          error={
                            Boolean(touched.MotifRejetGarantie) &&
                            Boolean(errors.MotifRejetGarantie)
                          }
                          helperText={
                            touched.MotifRejetGarantie &&
                            errors.MotifRejetGarantie
                          }
                          sx={{ marginBottom: 2 }}
                        />
                        <TextField
                          label='Remarque'
                          type='Remarque'
                          onBlur={handleBlur}
                          onChange={(e) => setNewRemarque(e.target.value)}
                          defaultValue={selectedRepair.Remarque}
                          name='Remarque'
                          error={
                            Boolean(touched.Remarque) &&
                            Boolean(errors.Remarque)
                          }
                          helperText={touched.Remarque && errors.Remarque}
                          sx={{ marginBottom: 2 }}
                        />
                        <TextField
                          label='Panne diagnostiquée'
                          type='PanneDiagnostique'
                          onBlur={handleBlur}
                          onChange={(e) =>
                            setNewPanneDiagnostique(e.target.value)
                          }
                          defaultValue={selectedRepair.PanneDiagnostique}
                          name='PanneDiagnostique'
                          error={
                            Boolean(touched.PanneDiagnostique) &&
                            Boolean(errors.PanneDiagnostique)
                          }
                          helperText={
                            touched.PanneDiagnostique &&
                            errors.PanneDiagnostique
                          }
                          sx={{ marginBottom: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        {!isSaved ? (
                          <>
                            <Button
                              type='submit'
                              variant='contained'
                              color='primary'
                              onClick={handleUpdate}
                            >
                              Enregistrer
                            </Button>
                            <Button
                              variant='contained'
                              color='secondary'
                              onClick={handleCancel}
                            >
                              Annuler
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant='contained'
                              color='secondary'
                              onClick={handleCancel}
                            >
                              Retourner à la création d'un RI
                            </Button>
                            <Button
                              type='submit'
                              variant='contained'
                              color='primary'
                            >
                              Passer à l'étape suivante
                            </Button>
                          </>
                        )}
                      </Grid>
                    </Grid>
                  )}
                  {!showForm &&
                    currentRepairState !== 'reception' &&
                    currentRepairState !== 'reparation' &&
                    currentRepairState !== 'diagnostic' &&
                    currentRepairState !== 'fin' && (
                      <Button
                        variant='contained'
                        color='primary'
                        onClick={handleButtonClick}
                      >
                        Créer un rapport
                      </Button>
                    )}
                  {RegisterModalOpen && (
                    <div
                      style={{ fontWeight: 'normal', color: '#66bb6a' }}
                      className='fade-out'
                    >
                      {RegistermodalText}
                    </div>
                  )}
                  {UpdateModalOpen && (
                    <div
                      style={{ fontWeight: 'normal', color: '#66bb6a' }}
                      className='updateFade-out'
                    >
                      {UpdatemodalText}
                    </div>
                  )}
                </form>
              )}
            </Formik>
          </Box>
        </Box>
      </Box>

      {/* BOX  TABLEAUX */}
      <Box display='flex' justifyContent='space-between' height='40vh'>
        {/* TABLEAU 1 EN COURS */}
        <Box width='45%'>
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
              paginationMode='server'
              sortingMode='server'
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
        <Box width='45%'>
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

export default Transactions;
