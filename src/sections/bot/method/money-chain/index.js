import { useSnackbar } from 'notistack';
import { format } from 'date-fns';

import {
  Grid,
  Card,
  MenuItem,
  IconButton,
  Stack,
  CardHeader,
  CardContent,
  Button,
  Divider,
  TextField,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { DataGrid } from '@mui/x-data-grid';

import { React, useState, useEffect } from 'react';

// import { useNavigate } from 'react-router-dom';

// import Iconify from '../../../../components/Iconify';
// import MenuPopover from '../../../../components/MenuPopover';
// import Label from '../../../../components/Label';

// import useLocales from '../../../../hooks/useLocales';
// import { PATH_DASHBOARD } from '../../../../routes/paths';
// import { API_BOT } from '../../../../apis';
import MethodList from './MethodList';
import Setting from './Setting';

const MoneyChain = () => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={6}>
        <Setting />
      </Grid>
      <Grid item xs={12} md={6}>
        <MethodList />
      </Grid>
    </Grid>
  );
};

export default MoneyChain;
