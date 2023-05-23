import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../slices/usersApiSlice";
import { setCredentials } from "../../slices/authSlice";
import * as yup from "yup";
import { Formik } from "formik";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";

const loginSchema = yup.object().shape({
  Pseudo: yup.string().required("veuillez rentrer votre pseudo"),
  Password: yup.string().required("veuillez rentrer votre mot de passe"),
});

const initialValuesLogin = {
  Pseudo: "",
  Password: "",
};

const Form = () => {
  const { palette } = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginMutation] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/dashboard");
    }
  }, [navigate, userInfo]);

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await loginMutation(values).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/dashboard");
      setSubmitting(false);
    } catch (err) {
      console.log(err.data.message || err.error);
    }
  };

  return (
    <Formik
      initialValues={initialValuesLogin}
      validationSchema={loginSchema}
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
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            <TextField
              label="Pseudo"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.Pseudo}
              name="Pseudo"
              error={Boolean(touched.Pseudo) && Boolean(errors.Pseudo)}
              helperText={touched.Pseudo && errors.Pseudo}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Mot de Passe"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.Password}
              name="Password"
              error={Boolean(touched.Password) && Boolean(errors.Password)}
              helperText={touched.Password && errors.Password}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: "#3FB500",
                color: palette.background.alt,
                "&:hover": { color: "#3FB500" },
              }}
            >
              CONNEXION
            </Button>
            <Typography
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            ></Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
