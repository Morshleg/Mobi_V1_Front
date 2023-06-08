import { Box } from '@mui/material';
import Header from 'components/Header';

const Dashboard = () => {
  // useEffect(() => {
  //   fetchToken();
  // }, []);

  // async function fetchToken() {
  //   try {
  //     const response = await axios.get('/api/token/');
  //     console.log('Le stock du produit a été mis à jour :', response.data);
  //   } catch (error) {
  //     console.error(
  //       "Une erreur s'est produite lors de la récupération du token :",
  //       error.message
  //     );
  //     // Gérer l'erreur, par exemple, afficher un message d'erreur à l'utilisateur
  //   }
  // }
  return (
    <Box m='1.5rem 2.5rem'>
      <Header title='DASHBOARD' subtitle='Dashboard MobiOne' />
    </Box>
  );
};

export default Dashboard;
