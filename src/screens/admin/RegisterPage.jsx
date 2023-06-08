import React, { useState } from "react";
import { Box, Button, TextField, MenuItem, Modal, Typography, Grid } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useRegisterMutation, useGetAllUsersQuery } from "slices/usersApiSlice";

import { useDispatch } from "react-redux";
import { addUserToList } from "slices/globalSlice";

const registerSchema = yup.object().shape({
  
  FirstName: yup.string().required("required"),
  LastName: yup.string().required("required"),
  Pseudo: yup.string().required("required"),
  Email: yup.string().email("invalid email").required("required"),
  Password: yup.string().required("required"),
  Role: yup
  .string()
  .required("Le rôle de l'utilisateur est requis")
  .oneOf(["Lecteur", "Reparateur","Vendeur", "Empereur"], "Le rôle n'est pas valide'")
  .default("Lecteur"),
});

const initialValuesRegister = {
  FirstName: "",
  LastName: "",
  Pseudo: "",
  Password: "",
  Email: "",
  Role: "Lecteur",
};

const RegisterPage = () => {

const dispatch = useDispatch();
  
const [addUser] = useRegisterMutation();
const [showModal, setShowModal] = useState(false);
const [successMessage, setSuccessMessage] = useState("");

const getAllUsersQuery = useGetAllUsersQuery();
  
/* LOGIQUE D'AJOUT de USERS */
const handleFormSubmit = async (values, onSubmitProps) => {
  try {
  const response = await addUser(values);

  const savedUser = response.data;
      if (savedUser) {
        dispatch(addUserToList(savedUser));
        // modal Enregistrement réussi
          setShowModal(true);
          setSuccessMessage("L'enregistrement a réussi !");
          setTimeout(() => {
            setShowModal(false);
            setSuccessMessage("");
          }, 2000);

        // Réinitialiser le formulaire après l'enregistrement de l'utilisateur
          onSubmitProps.resetForm();
        // Mettre à jour le tableau des utilisateurs
        await getAllUsersQuery.refetch();
      } else {
        // Enregistrement échoué
          console.error("Erreur lors de l'enregistrement de l'utilisateur");
      }
    } catch (error) {}
  };
  

  return (
    <Box m="1.5rem 2.5rem" display="flex" flexDirection="column" alignItems="center">

    <Modal open={showModal} onClose={() => setShowModal(false)} >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "grey",
          borderRadius: "8px",
          padding: "16px",
          textAlign: "center",
          animation: showModal ? "fadeOut 3s forwards" : "none",
          
        }}
      >
        <Typography variant="h6">{successMessage}</Typography>
      </Box>
    </Modal>
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
              label="Prénom"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.FirstName}
              required
              name="FirstName"
              error={Boolean(touched.FirstName) && Boolean(errors.FirstName)}
              helperText={touched.FirstName && errors.FirstName}
              sx={{ marginBottom: 2 }}
            />
            </Grid>
            <Grid item xs={6}>
            <TextField
              label="Nom"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.LastName}
              required
              name="LastName"
              error={Boolean(touched.LastName) && Boolean(errors.LastName)}
              helperText={touched.LastName && errors.LastName}
              sx={{ marginBottom: 2 }}
            />
            </Grid>
            <Grid item xs={6}>
             <TextField
              label="Pseudo"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.Pseudo}
              required
              name="Pseudo"
              error={Boolean(touched.Pseudo) && Boolean(errors.Pseudo)}
              helperText={touched.Pseudo && errors.Pseudo}
              sx={{ marginBottom: 2 }}
            />
            </Grid>
            <Grid item xs={6}>
            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.Email}
              required
              name="Email"
              error={Boolean(touched.Email) && Boolean(errors.Email)}
              helperText={touched.Email && errors.Email}
              sx={{ marginBottom: 2 }}
              autoComplete="off"
            />
            </Grid>
            <Grid item xs={6}>
           <TextField
              label="Password"
              type="Password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.Password}
              required
              name="Password"
              error={Boolean(touched.Password) && Boolean(errors.Password)}
              helperText={touched.Password && errors.Password}
              sx={{ marginBottom: 2 }}
              autoComplete="new-password"
              readOnly 
            />
            </Grid>
            <Grid item xs={6}>
            <TextField
              select
              label="Role"
              name="Role"
              required
              value={values.Role}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.Role && Boolean(errors.Role)}
              helperText={touched.Role && errors.Role}
              sx={{ marginBottom: 2 }}
            >
              <MenuItem value="Lecteur">Lecteur</MenuItem>
              <MenuItem value="Reparateur">Reparateur</MenuItem>
              <MenuItem value="Vendeur">Vendeur</MenuItem>
              <MenuItem value="Empereur">Empereur</MenuItem>

            </TextField>
            </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Ajouter
          </Button>
        </Grid>
      </Grid>
    </form>
        )}
      </Formik>
    </Box>
  );
};

export default RegisterPage;