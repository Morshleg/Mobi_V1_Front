import React from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'components/Snackbar';

const registerSchema = yup.object().shape({
  Designation: yup.string().required('Le designation du produit est requise'),
  Taille: yup.number(),
  Couleur: yup.string(),
  Famille: yup.string(),
  Type: yup.string(),
  NeufOccasion: yup
    .string()
    .required("l'etat du produit est requis")
    .oneOf(['neuf', 'occasion'], "Le produit doit etre ou 'neuf' ou 'occasion'")
    .default('occasion'),
  Garantie: yup.string(),
  PointDeVente: yup
    .string()
    .oneOf(
      ['St-Pierre', 'St-Paul'],
      "Le point de vente doit etre 'St-Pierre' ou 'St-Paul'"
    )
    .default('St-Paul'),
  Stock: yup.number(),
  Quantite: yup.string(),
  VenteHT: yup.string(),
  TauxTVA: yup.string(),
  VenteTTC: yup.string(),
});

const initialValuesRegister = {
  Designation: '',
  Taille: '',
  Couleur: '',
  Famille: '',
  Type: '',
  NeufOccasion: 'occasion',
  Garantie: '',
  PointDeVente: 'St-Paul',
  Stock: '',
  Quantite: '',
  VenteHT: '',
  TauxTVA: '',
  VenteTTC: '',
};

const ProductRegister = () => {
  const {
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    handleSnackbarClose,
    showSnackbar,
  } = useSnackbar();

  const handleFormSubmit = async (values, onSubmitProps) => {
    const product = JSON.stringify(values);

    const response = await fetch('http://localhost:5000/api/products/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: product,
    });

    const savedProduct = await response.json();
    onSubmitProps.resetForm();

    if (savedProduct) {
      showSnackbar('Le produit a été enregistré avec succès', 'success');
      // Réinitialiser le formulaire après l'enregistrement du produit
      onSubmitProps.resetForm();
    } else {
      showSnackbar("Erreur lors de l'enregistrement du produit", 'error');
    }
  };

  return (
    <Box m='1.5rem 2.5rem'>
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
          resetForm,
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label='Designation'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.Designation}
                  name='Designation'
                  error={
                    Boolean(touched.Designation) && Boolean(errors.Designation)
                  }
                  helperText={touched.Designation && errors.Designation}
                  sx={{ marginBottom: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label='Taille'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.Taille}
                  name='Taille'
                  error={Boolean(touched.Taille) && Boolean(errors.Taille)}
                  helperText={touched.Taille && errors.Taille}
                  sx={{ marginBottom: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label='Couleur'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.Couleur}
                  name='Couleur'
                  error={Boolean(touched.Couleur) && Boolean(errors.Couleur)}
                  helperText={touched.Couleur && errors.Couleur}
                  sx={{ marginBottom: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label='Famille'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.Famille}
                  name='Famille'
                  error={Boolean(touched.Famille) && Boolean(errors.Famille)}
                  helperText={touched.Famille && errors.Famille}
                  sx={{ marginBottom: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label='Type'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.Type}
                  name='Type'
                  error={Boolean(touched.Type) && Boolean(errors.Type)}
                  helperText={touched.Type && errors.Type}
                  sx={{ marginBottom: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  label='État'
                  name='NeufOccasion'
                  value={values.NeufOccasion}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.NeufOccasion && Boolean(errors.NeufOccasion)}
                  helperText={touched.NeufOccasion && errors.NeufOccasion}
                  sx={{ marginBottom: 2 }}
                >
                  <MenuItem value='neuf'>Neuf</MenuItem>
                  <MenuItem value='occasion'>Occasion</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label='Garantie'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.Garantie}
                  name='Garantie'
                  error={Boolean(touched.Garantie) && Boolean(errors.Garantie)}
                  helperText={touched.Garantie && errors.Garantie}
                  sx={{ marginBottom: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  label='Point de vente'
                  name='Point de vente'
                  value={values.PointDeVente}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.PointDeVente && Boolean(errors.PointDeVente)}
                  helperText={touched.PointDeVente && errors.PointDeVente}
                  sx={{ marginBottom: 2 }}
                >
                  <MenuItem value='St-Pierre'>St-Pierre</MenuItem>
                  <MenuItem value='St-Paul'>St-Paul</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label='Stock'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.Stock}
                  name='Stock'
                  error={Boolean(touched.Stock) && Boolean(errors.Stock)}
                  helperText={touched.Stock && errors.Stock}
                  sx={{ marginBottom: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label='Quantite'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.Quantite}
                  name='Quantite'
                  error={Boolean(touched.Quantite) && Boolean(errors.Quantite)}
                  helperText={touched.Quantite && errors.Quantite}
                  sx={{ marginBottom: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label='VenteHT'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.VenteHT}
                  name='VenteHT'
                  error={Boolean(touched.VenteHT) && Boolean(errors.VenteHT)}
                  helperText={touched.VenteHT && errors.VenteHT}
                  sx={{ marginBottom: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label='TauxTVA'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.TauxTVA}
                  name='TauxTVA'
                  error={Boolean(touched.TauxTVA) && Boolean(errors.TauxTVA)}
                  helperText={touched.TauxTVA && errors.TauxTVA}
                  sx={{ marginBottom: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label='VenteTTC'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.VenteTTC}
                  name='VenteTTC'
                  error={Boolean(touched.VenteTTC) && Boolean(errors.VenteTTC)}
                  helperText={touched.VenteTTC && errors.VenteTTC}
                  sx={{ marginBottom: 2 }}
                />
              </Grid>
            </Grid>
            <Button type='submit' variant='contained' color='primary'>
              Ajouter
            </Button>
          </form>
        )}
      </Formik>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '90%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductRegister;
