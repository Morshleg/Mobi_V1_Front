import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const ConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  userToDelete,
  userPseudo,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '40%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant='h6' gutterBottom>
          Confirmation de suppression
        </Typography>
        <Typography variant='body1'>
          Êtes-vous sûr de vouloir supprimer {userPseudo} ?
        </Typography>
        <Box display='flex' justifyContent='flex-end' marginTop='1rem'>
          <Button variant='outlined' color='secondary' onClick={onClose}>
            Annuler
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={() => onConfirm(userToDelete)}
            style={{ marginLeft: '1rem' }}
          >
            Confirmer
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;
