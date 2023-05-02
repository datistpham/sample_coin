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

import Setting from './Setting';
import MethodList from './MethodList';

const MoneyBubble = () => (
  <Grid container spacing={1}>
    <Grid item xs={12} md={6}>
      <Setting />
    </Grid>
    <Grid item xs={12} md={6}>
      <MethodList />
    </Grid>
  </Grid>
);

export default MoneyBubble;
