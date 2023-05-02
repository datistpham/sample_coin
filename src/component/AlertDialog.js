import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';

// import Avatar from '@mui/material/Avatar';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemAvatar from '@mui/material/ListItemAvatar';
// import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

// import PersonIcon from '@mui/icons-material/Person';
// import AddIcon from '@mui/icons-material/Add';
// import Typography from '@mui/material/Typography';
// import { blue } from '@mui/material/colors';
import { DialogContent, Grid, IconButton } from '@mui/material';
import useLocales from '../hooks/useLocales';
import Iconify from './Iconify';

export default function AlertDialog({ isOpen, setOpen, data }) {
  const { translate } = useLocales();

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    try {
      if (data.callback) {
        data.callback();
        handleClose();
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent sx={{ textAlign: 'center' }}>
        <Grid container spacing={1} sx={{ textAlign: 'center' }}>
          <Grid item xs={12} md={12}>
            <IconButton width={70} height={70}>
              <Iconify
                width={70}
                height={70}
                sx={{ color: `${data.type}.main` }}
                icon={'material-symbols:info-rounded'}
              />
            </IconButton>
          </Grid>
          <Grid item xs={12} md={12}>
            <DialogTitle sx={{ textAlign: 'center' }}>{data.title}</DialogTitle>
          </Grid>
          <Grid item xs={12} md={12}>
            {data.content}
          </Grid>
          <Grid item xs={6} md={6} textAlign="center" sx={{ marginTop: 2 }}>
            <Button
              size="large"
              startIcon={<Iconify icon="line-md:confirm-circle-twotone" />}
              variant="contained"
              sx={{ width: '90%' }}
              color="primary"
              onClick={handleConfirm}
            >
              {translate('confirm')}
            </Button>
          </Grid>
          <Grid item xs={6} md={6} textAlign="center" sx={{ marginTop: 2 }}>
            <Button
              size="large"
              startIcon={<Iconify icon="material-symbols:cancel" />}
              variant="contained"
              sx={{ width: '90%' }}
              color="error"
              onClick={handleClose}
            >
              {translate('cancel')}
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
