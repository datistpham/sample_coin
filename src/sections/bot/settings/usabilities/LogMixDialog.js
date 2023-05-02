import { useSnackbar } from 'notistack';
import { format } from 'date-fns';

import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';

import {
  Grid,
  CircularProgress,
  Stack,
  IconButton,
  TextField,
  MenuItem,
  Button,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Paper,
  Divider,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import Draggable from 'react-draggable';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useLocales from 'src/hooks2/useLocales';
import { API_TELEBOT } from 'src/apis';
import Label from 'src/component/Label';
import Iconify from 'src/component/Iconify';
import { RHFTextField } from 'src/component/hook-form';


// import Iconify from '../../../../components/Iconify';
// import useLocales from '../../../../hooks/useLocales';
// import Label from '../../../../components/Label';

// // components
// import { FormProvider, RHFTextField } from '../../../../components/hook-form';

// import { API_TELEBOT } from '../../../../apis';

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

export default function LogMixDialog({ botIds = [], isOpen, setIsOpen }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const theme = useTheme();

  const [loading, setLoading] = useState(true);

  const [maxWidth, setMaxWidth] = useState('md');

  const handleClose = () => {
    setIsOpen(false);
  };

  const [rows, setRows] = useState([]);

  const [info, setInfo] = useState({
    winTotal: 0,
    loseTotal: 0,
    percentWin: 0,
  });
  const [count, setCount] = useState(50);

  useEffect(() => {
    if (isOpen) handleSubmit();
  }, [botIds, isOpen]);

  const handleSubmit = async () => {
    try {
      const response = await API_TELEBOT.getLogMixById(botIds, count);

      if (response.data.ok) {
        setRows(response.data.d);
        setInfo(response.data.info);

        return;
      }
      enqueueSnackbar(translate(response.data.m), { variant: 'error' });
    } catch (e) {
      console.log(e);
    }
  };

  const columns = [
    {
      field: 'session',
      headerName: translate('session'),
      minWidth: 80,
      width: 80,
      maxWidth: 130,
      flex: 0.8,
      renderCell: (cellValues) => (
        <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} color={'default'}>
          {cellValues.row.session}
        </Label>
      ),
    },
    {
      field: 'betType',
      headerName: translate('bet_type'),
      minWidth: 60,
      width: 80,
      maxWidth: 100,
      flex: 0.8,
      renderCell: (cellValues) => (
        <IconButton sx={{ bgcolor: cellValues.row.betType === 'UP' ? 'success.main' : 'error.main' }} size={'small'}>
          <Iconify
            icon={cellValues.row.betType === 'UP' ? 'fa6-solid:arrow-trend-up' : 'fa6-solid:arrow-trend-down'}
            width={15}
            height={15}
            sx={{
              color: 'white',
            }}
          />
        </IconButton>
      ),
    },
    {
      field: 'result',
      headerName: translate('result'),
      minWidth: 60,
      width: 80,
      maxWidth: 100,
      flex: 0.8,
      renderCell: (cellValues) => {
        const row = cellValues.row;
        if (row.result === 0)
          return (
            <Label
              variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
              color={'error'}
              sx={{ fontSize: '0.8em' }}
            >
              LOSE
            </Label>
          );
        if (row.result === 1)
          return (
            <Label
              variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
              color={'success'}
              sx={{ fontSize: '0.8em' }}
            >
              WIN
            </Label>
          );
        if (row.result === 2)
          return (
            <Label
              variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
              color={'default'}
              sx={{ fontSize: '0.8em' }}
            >
              TIE-BREAK
            </Label>
          );
        if (row.result === 3)
          return (
            <div style={{ position: 'relative' }}>
              <CircularProgress color="warning" percentage={12} size={25} />
            </div>
          );
      },
    },
    {
      field: 'win_streak',
      headerName: translate('win_streak'),
      minWidth: 80,
      width: 100,
      maxWidth: 120,
      flex: 0.8,
      renderCell: (cellValues) => {
        const row = cellValues.row;

        return (
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={'success'}
            sx={{ fontSize: '0.8em' }}
          >
            {row.winStreak}/{row.bestWinStreak}
          </Label>
        );
      },
    },
    {
      field: 'loss_streak',
      headerName: translate('loss_streak'),
      minWidth: 80,
      width: 100,
      maxWidth: 120,
      flex: 0.8,
      renderCell: (cellValues) => {
        const row = cellValues.row;

        return (
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={'error'}
            sx={{ fontSize: '0.8em' }}
          >
            {row.loseStreak}/{row.bestLoseStreak}
          </Label>
        );
      },
    },
    {
      field: 'victor_streak',
      headerName: translate('victor_streak'),
      minWidth: 80,
      width: 100,
      maxWidth: 120,
      flex: 0.8,
      renderCell: (cellValues) => {
        const row = cellValues.row;

        return (
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={'warning'}
            sx={{ fontSize: '0.8em' }}
          >
            {row.victorStreak}/{row.bestVictorStreak}
          </Label>
        );
      },
    },
    {
      field: 'betTime',
      headerName: translate('time'),
      minWidth: 120,
      width: 150,
      maxWidth: 200,
      flex: 0.8,
      renderCell: (cellValues) => (
        <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} color={'secondary'}>
          {format(new Date(cellValues.row.betTime), 'HH:mm:ss dd/MM')}
        </Label>
      ),
    },
  ];

  return (
    <>
      <Dialog
        open={isOpen}
        PaperComponent={PaperComponent}
        onClose={handleClose}
        maxWidth={maxWidth}
        fullWidth
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          {translate('Log Mix')}
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6} md={7}>
              <Card>
                <CardContent>
                  <Stack spacing={1}>
                    <Grid item xs={12} md={12}>
                      <RHFTextField
                        name="count"
                        onChange={(e) => {
                          setCount(e.target.value);
                        }}
                        value={count}
                        label={`${translate('number_of_sessions')} (< 1000)`}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <Button
                        size="small"
                        type="submit"
                        startIcon={<Iconify icon={'carbon:load-balancer-pool'} />}
                        fullWidth
                        onClick={handleSubmit}
                        variant="contained"
                      >
                        {' '}
                        {translate('confirm')}{' '}
                      </Button>
                    </Grid>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={5}>
              <Card>
                <CardContent>
                  <Stack spacing={1}>
                    <Label
                      variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                      sx={{ p: 2 }}
                      color={'success'}
                    >
                      {translate('win_total')} : {info.winTotal}
                    </Label>
                    <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} sx={{ p: 2 }} color={'error'}>
                      {translate('lose_total')} : {info.loseTotal}
                    </Label>
                    <Label
                      variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                      sx={{ p: 2 }}
                      color={'warning'}
                    >
                      {translate('rate_win')} : {parseFloat(info.percentWin.toFixed(2))} %
                    </Label>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={12}>
              <DataGrid
                disableColumnSelector
                disableColumnMenu
                disableColumnFilter
                autoHeight
                rows={rows}
                columns={columns}
                components={{
                  LoadingOverlay: () => (
                    <Stack height="100%" alignItems="center" justifyContent="center">
                      {translate('data_loading')}
                    </Stack>
                  ),
                  NoRowsOverlay: () => (
                    <Stack height="100%" alignItems="center" justifyContent="center">
                      {translate('no_data_to_display')}
                    </Stack>
                  ),
                  NoResultsOverlay: () => (
                    <Stack height="100%" alignItems="center" justifyContent="center">
                      {translate('no_data_to_display')}
                    </Stack>
                  ),
                }}
                getRowId={(row) => row.session}
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}
