import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import MobiOneLogo from "../../assets/MobiOneLogo.png";
import Form from "./Form.jsx";

const LoginScreen = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
    <Box>
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          <img
            src={MobiOneLogo}
            alt="MobiOne"
            style={{ width: "20%", height: "auto" }}
          />
        </Typography>
      </Box>

      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography sx={{ mb: "1.5rem" }}></Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginScreen;
