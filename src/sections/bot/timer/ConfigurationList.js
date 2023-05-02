import { useSnackbar } from 'notistack';
import { format } from 'date-fns';

import {
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

import { React, useState, useEffect, useContext } from 'react';

// import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import useLocales from 'src/hooks2/useLocales';
import { getBotTimerList } from 'src/redux/dashboard/account/action';
import { API_BOT } from 'src/apis';
import Label from 'src/component/Label';
import Iconify from 'src/component/Iconify';
import MenuPopover from 'src/component/MenuPopover';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { useRouter } from 'next/router';

// import Iconify from '../../../components/Iconify';
// import MenuPopover from '../../../components/MenuPopover';
// import Label from '../../../components/Label';
// import { getBotTimerList } from '../../../redux/dashboard/account/action';

// import useLocales from '../../../hooks/useLocales';
// import { PATH_DASHBOARD } from '../../../routes/paths';
// import { API_BOT } from '../../../apis';

// routes
function ConfigurationList() {
  const { translate } = useLocales();
  const theme = useTheme();

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const getTimerList = async () => {
    dispatch(await getBotTimerList());
  };

  const botTimerList = useSelector((state) => state.botTimerList);

  const handleDeleteConfiguration = async (_id) => {
    const response = await API_BOT.deleteTimerById(_id);
    if (response.data.ok) {
      await getTimerList();
      enqueueSnackbar(translate(response.data.d.err_code), { variant: 'success' });

      return;
    }
    enqueueSnackbar(translate('failed'), { variant: 'error' });
  };

  const handleActionBot = async (_id, actionType) => {
    const response = await API_BOT.actionBot(_id, actionType);
    if (response.data.ok) {
      await getTimerList();
      enqueueSnackbar(translate(response.data.d.err_code), { variant: 'success' });

      return;
    }
    enqueueSnackbar(translate(response.data.d.err_code), { variant: 'error' });
  };

  const handleDeleteSelectedItem = async () => {
    const current = { count: 0 };
    await Promise.all(
      selectedItem.map(async (item) => {
        const response = await API_BOT.deleteTimerById(item._id);
        if (response.data.ok) {
          current.count += 1;

          return;
        }
        enqueueSnackbar(translate('failed'), { variant: 'error' });
      })
    );
    enqueueSnackbar(`${translate('successful_delete')} ${current.count} ${translate('configuration')}`, {
      variant: 'success',
    });
    getTimerList();
  };

  useEffect(() => {
    getTimerList();
  }, []);

  useEffect(() => {
    setRows(botTimerList);
  }, [botTimerList]);

  const [rows, setRows] = useState([]);

  const columns = [
    {
      field: 'actions',
      headerName: translate('actions'),
      minWidth: 80,
      width: 80,
      maxWidth: 100,
      flex: 1,
      renderCell: (cellValues) => (
        <MoreMenuButton
          handleActionBot={handleActionBot}
          handleDelete={handleDeleteConfiguration}
          details={cellValues.row}
          id={cellValues.row._id}
          colorBtn={cellValues.row.isRunning ? 'success.main' : 'warning.main'}
        />
      ),
    },
    {
      field: 'name',
      headerName: translate('name'),
      minWidth: 120,
      width: 150,
      maxWidth: 200,
      flex: 0.8,
    },
    {
      field: 'time',
      headerName: translate('time'),
      minWidth: 100,
      width: 130,
      maxWidth: 150,
      flex: 0.8,
      renderCell: (cellValues) => (
        <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} color={'info'}>
          {cellValues.row.hour < 10 ? `0${cellValues.row.hour}` : cellValues.row.hour} :{' '}
          {cellValues.row.minute < 10 ? `0${cellValues.row.minute}` : cellValues.row.minute}
        </Label>
      ),
    },
    {
      field: 'action_type',
      headerName: translate('actions'),
      minWidth: 120,
      width: 150,
      maxWidth: 200,
      flex: 0.8,
      renderCell: (cellValues) => (
        <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} color={'secondary'}>
          {cellValues.row.action_type === 'start'
            ? `${translate('on')} ${cellValues.row.bot_ids.length} bot`
            : `${translate('off')} ${cellValues.row.bot_ids.length} bot`}
        </Label>
      ),
    },
    {
      field: 'status',
      headerName: translate('status'),
      minWidth: 120,
      width: 120,
      maxWidth: 150,
      flex: 0.8,
      renderCell: (cellValues) => (
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={cellValues.row.is_processed ? 'success' : 'error'}
        >
          {cellValues.row.is_processed ? translate('processed') : translate('unprocessed')}
        </Label>
      ),
    },
  ];

  const [selectedItem, setSelectedItem] = useState([]);

  const onRowsSelectionHandler = (ids) => {
    const selectedRowsData = ids.map((id) => rows.find((row) => row._id === id));
    setSelectedItem(selectedRowsData);
  };

  return (
    <>
      <Card>
        <CardHeader
          title={translate('configuration_list')}
          action={
            <Stack spacing={1} direction="row">
              {' '}
              {selectedItem.length > 0 ? (
                <>
                  {' '}
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleDeleteSelectedItem}
                    color="error"
                    startIcon={<Iconify icon={'ep:delete-filled'} />}
                  >
                    {translate('delete')}
                  </Button>
                </>
              ) : (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={getTimerList}
                  color="info"
                  startIcon={<Iconify icon={'icon-park-solid:refresh-one'} />}
                >
                  {translate('refresh')}
                </Button>
              )}
            </Stack>
          }
        />
        <CardContent>
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
            getRowId={(row) => row._id}
            pageSize={10}
            rowsPerPageOptions={[10]}
            checkboxSelection
            disableSelectionOnClick
            onSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
          />
        </CardContent>
      </Card>
    </>
  );
}

// ----------------------------------------------------------------------

function MoreMenuButton({ handleDelete, handleActionBot, details, id, colorBtn = 'warning.main' }) {
  const { translate } = useLocales();
  const navigate = useRouter();

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const ICON = {
    mr: 2,
    width: 20,
    height: 20,
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleOpen}
        sx={{
          color: details.isRunning ? 'success.main' : 'warning.main',
        }}
      >
        <Iconify icon={'ant-design:setting-filled'} width={25} height={25} />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        arrow="right-top"
        sx={{
          mt: -0.5,
          width: 160,
          '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 },
        }}
      >
        <MenuItem
          sx={{ color: 'warning.main' }}
          onClick={() => {
            navigate.push(PATH_DASHBOARD.bot.edit_timer(id));
            setOpen(null);
          }}
        >
          <Iconify icon={'fluent-emoji:pencil'} sx={{ ...ICON }} />
          {translate('edit')}
        </MenuItem>

        <MenuItem
          sx={{ color: 'error.main' }}
          onClick={() => {
            handleDelete(id);
            setOpen(null);
          }}
        >
          <Iconify icon={'eva:trash-2-outline'} sx={{ ...ICON }} />
          {translate('delete')}
        </MenuItem>
      </MenuPopover>
    </>
  );
}

export default ConfigurationList;
