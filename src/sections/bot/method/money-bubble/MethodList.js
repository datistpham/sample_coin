import { useSnackbar } from 'notistack';
import { format } from 'date-fns';

import { Card, MenuItem, IconButton, Stack, CardHeader, CardContent, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { DataGrid } from '@mui/x-data-grid';

import { React, useState, useEffect } from 'react';

// import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import useLocales from 'src/hooks2/useLocales';
import { getMethodList } from 'src/redux/dashboard/account/action';
import { API_BOT } from 'src/apis';
import AlertDialog from 'src/component/AlertDialog';
import DonateDialog from '../DonateDialog';
import Iconify from 'src/component/Iconify';
import MenuPopover from 'src/component/MenuPopover';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { useRouter } from 'next/router';

// import Iconify from '../../../../components/Iconify';
// import MenuPopover from '../../../../components/MenuPopover';
// import Label from '../../../../components/Label';
// import { getMethodList } from '../../../../redux/dashboard/account/action';

// import useLocales from '../../../../hooks/useLocales';
// import { PATH_DASHBOARD } from '../../../../routes/paths';
// import { API_BOT } from '../../../../apis';
// import DonateDialog from '../DonateDialog';
// import AlertDialog from '../../../../components/AlertDialog';

// routes
function MethodList() {
  const { translate } = useLocales();

  const theme = useTheme();

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const methodList = useSelector((state) => state.methodList);

  const getMethods = async () => {
    dispatch(await getMethodList());
  };

  const handleDeleteConfiguration = async (_id) => {
    const next = async () => {
      try {
        const response = await API_BOT.deleteMethodById(_id);
        if (response.data.ok) {
          await getMethods();
          enqueueSnackbar(translate('successful_delete'), { variant: 'success' });

          return;
        }
        enqueueSnackbar(translate('failed'), { variant: 'error' });
      } catch (e) {
        console.log(e);
      }
    };
    handleOpenAlertDialog(translate('are_u_want_to_del_method'), '', 'warning', next);
  };

  useEffect(() => {
    setRows(methodList.filter((a) => a.type === 2));

  }, [methodList]);

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
      field: 'conditionCount',
      headerName: translate('conditions'),
      minWidth: 120,
      width: 120,
      maxWidth: 150,
      flex: 0.8,
      renderCell: (cellValues) => {
        return `${cellValues.row.data.conditions.length} ${translate('conditions')}`;
      },
    },
  ];

  const [selectedItem, setSelectedItem] = useState([]);

  const onRowsSelectionHandler = (ids) => {
    const selectedRowsData = ids.map((id) => rows.find((row) => row._id === id));
    setSelectedItem(selectedRowsData);
  };

  const handleDeleteSelectedItem = async () => {
    const next = async () => {
      try {
        const current = { count: 0 };
        await Promise.all(
          selectedItem.map(async (item) => {
            const response = await API_BOT.deleteMethodById(item._id);
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
        getMethods();
      } catch (e) {
        console.log(e);
      }
    };
    handleOpenAlertDialog(translate('are_u_want_to_del_method'), '', 'warning', next);
  };

  useEffect(() => {
    getMethods();
  }, []);

  const [openDonate, setDonate] = useState(false);

  const getMethodsDonate = () => {
    const array = [];
    selectedItem.forEach((item) => {
      array.push(item._id);
    });

    return array;
  };

  const [alertData, setAlertData] = useState({
    title: '',
    content: '',
    type: 'info',
    callback: () => {},
  });
  const [isOpenAlertDialog, setOpenAlertDialog] = useState(false);

  const handleOpenAlertDialog = (title, content, type, callback) => {
    try {
      setAlertData({
        title,
        content,
        type,
        callback,
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (alertData.title !== '') setOpenAlertDialog(true);
  }, [alertData]);

  return (
    <>
      <AlertDialog isOpen={isOpenAlertDialog} setOpen={setOpenAlertDialog} data={alertData} />

      <DonateDialog methodIds={getMethodsDonate()} isOpen={openDonate} setIsOpen={setDonate} />

      <Card>
        <CardHeader
          title={translate('method_list')}
          action={
            <Stack spacing={1} direction="row">
              {' '}
              {selectedItem.length > 0 ? (
                <>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setDonate(true);
                    }}
                    color="info"
                    startIcon={<Iconify icon={'mdi:donate'} />}
                  >
                    {translate('donate')}
                  </Button>
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
                  onClick={getMethods}
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

function MoreMenuButton({ handleDelete, details, id, colorBtn = 'warning.main' }) {
  const { translate } = useLocales();
  const navigate = useRouter();

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const [openDonate, setDonate] = useState(false);

  const ICON = {
    mr: 2,
    width: 20,
    height: 20,
  };

  return (
    <>
      <DonateDialog methodIds={[id]} isOpen={openDonate} setIsOpen={setDonate} />

      <IconButton
        size="small"
        onClick={handleOpen}
        sx={{
          color: 'warning.main',
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
          sx={{ color: 'success.main' }}
          onClick={() => {
            setDonate(true);
            setOpen(null);
          }}
        >
          <Iconify icon={'mdi:donate'} sx={{ ...ICON }} />
          {translate('donate')}
        </MenuItem>
        {details && !details.fromId && (
          <>
            <MenuItem
              sx={{ color: 'warning.main' }}
              onClick={() => {
                navigate.push(PATH_DASHBOARD.bot.edit_bubble_method(id));
                setOpen(null);
              }}
            >
              <Iconify icon={'fluent-emoji:pencil'} sx={{ ...ICON }} />
              {translate('edit')}
            </MenuItem>
          </>
        )}
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

export default MethodList;
