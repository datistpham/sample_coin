import { useSnackbar } from 'notistack';

// @mui
import { Container, Stack, Tab, Box, Tabs, Card, CardHeader, CardContent, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import useLocales from 'src/hooks2/useLocales';
import useTabs from 'src/hooks2/useTabs';
import Iconify from 'src/component/Iconify';
import { getFollowersData } from 'src/redux/dashboard/account/action';
import { API_COPYTRADE } from 'src/apis';
import TextIconLabel from 'src/component/TextIconLabel';
import Label from 'src/component/Label';


function FollowersAction(props) {
  const { translate } = useLocales();

  const { currentTab, onChangeTab } = useTabs(translate('following'));

  const FOLLOWERS_TABS = [
    {
      value: translate('following'),
      icon: <Iconify icon={'ri:user-follow-fill'} width={20} height={20} />,
      component: <Following />,
    },
    {
      value: translate('blocking'),
      icon: <Iconify icon={'material-symbols:app-blocking-sharp'} width={20} height={20} />,
      component: <Blocking />,
    },
  ];

  return (
    <Card>
      <CardContent>
        {' '}
        <Tabs allowScrollButtonsMobile scrollButtons="auto" value={currentTab} onChange={onChangeTab}>
          {FOLLOWERS_TABS.map((tab) => (
            <Tab disableRipple key={tab.value} label={tab.value} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>
        <Box />
        {FOLLOWERS_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;

          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </CardContent>
    </Card>
  );
}

const Following = () => {
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();
  const followerData = useSelector((state) => state.followersData);

  const showFollowersData = async (isBlock = false) => {
    dispatch(await getFollowersData());
  };

  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(followerData.followers);
  }, [followerData, followerData.follower]);
  const theme = useTheme();

  const { translate } = useLocales();

  const handleBlock = async (_id) => {
    try {
      const response = await API_COPYTRADE.getBlockList(_id);

      if (response.data.ok) {
        enqueueSnackbar(translate('success'), { variant: 'success' });
        showFollowersData(true);

        return;
      }
      enqueueSnackbar(translate(response.data.err_code), { variant: 'error' });
    } catch (e) {
      console.log(e);
    }
  };

  const columns = [
    {
      field: '_id',
      hide: true,
    },
    {
      field: 'nickName',
      headerName: translate('nickname'),
      minWidth: 120,
      width: 120,
      maxWidth: 200,
      flex: 1,
      renderCell: (cellValues) => (
        <TextIconLabel
          style={{
            fontSize: '1em',
          }}
          icon={
            <img
              src={`/client-icons/${cellValues.row.clientId}.ico`}
              style={{ width: '15px', height: '15px', marginRight: '0.5em', marginTop: '0.2em' }}
              alt="icon "
            />
          }
          value={cellValues.row.nickName}
          sx={{ typography: 'caption' }}
        />
      ),
    },
    {
      field: 'accountType',
      headerName: translate('account_type'),
      minWidth: 90,
      width: 90,
      maxWidth: 200,
      flex: 0.8,
    },
    {
      field: 'volumeDay',
      headerName: translate('volume_day_sort'),
      minWidth: 100,
      width: 130,
      maxWidth: 200,
      renderCell: (cellValues) => (
        <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} color={'warning'}>
          {parseFloat(cellValues.row.volumeDay.toFixed(2))}$
        </Label>
      ),
    },
    {
      field: 'profitDay',
      headerName: translate('profit_day_sort'),
      minWidth: 100,
      width: 130,
      maxWidth: 200,
      renderCell: (cellValues) => (
        <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} color={'success'}>
          {cellValues.row.profitDay >= 0
            ? `+${parseFloat(cellValues.row.profitDay.toFixed(2))}`
            : parseFloat(cellValues.row.profitDay.toFixed(2))}{' '}
          $
        </Label>
      ),
    },
    {
      field: 'sponsor',
      headerName: translate('sponsor'),
      minWidth: 100,
      width: 100,
      maxWidth: 200,
      flex: 1,
      renderCell: (cellValues) =>
        cellValues.row.sponsor ? (
          <TextIconLabel
            style={{
              fontSize: '1em',
            }}
            icon={
              <img
                src={`/client-icons/${cellValues.row.clientId}.ico`}
                style={{ width: '15px', height: '15px', marginRight: '0.5em', marginTop: '0.2em' }}
                alt="icon "
              />
            }
            value={cellValues.row.sponsor}
            sx={{ typography: 'caption' }}
          />
        ) : (
          <></>
        ),
    },

    {
      field: 'blockBtn',
      headerName: translate('actions'),
      minWidth: 100,
      width: 100,
      maxWidth: 200,
      renderCell: (cellValues) => (
        <Button
          variant={'contained'}
          onClick={() => {
            handleBlock(cellValues.row.nickName);
          }}
          color={'error'}
          size="small"
        >
          Chặn
        </Button>
      ),
    },
  ];

  return (
    <DataGrid
      disableColumnSelector
      disableColumnMenu
      disableColumnFilter
      autoHeight
      rows={rows}
      columns={columns}
      components={{
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
      disableSelectionOnClick
    />
  );
};

const Blocking = () => {
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const showFollowersData = async (isBlock = false) => {
    dispatch(await getFollowersData());
  };
  const followerData = useSelector((state) => state.followersData);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (followerData.followers) {
      setRows(followerData.followersBlocking);
    }
  }, [followerData]);
  const theme = useTheme();

  const { translate } = useLocales();

  const handleUnBlock = async (_id) => {
    try {
      const response = await API_COPYTRADE.getUnblockList(_id);

      if (response.data.ok) {
        enqueueSnackbar(translate('success'), { variant: 'success' });
        showFollowersData(true);

        return;
      }
      enqueueSnackbar(translate(response.data.err_code), { variant: 'error' });
    } catch (e) {
      console.log(e);
    }
  };

  const columns = [
    {
      field: '_id',
      hide: true,
    },
    {
      field: 'nickName',
      headerName: translate('nickname'),
      minWidth: 120,
      width: 120,
      maxWidth: 200,
      flex: 1,
      renderCell: (cellValues) => (
        <TextIconLabel
          style={{
            fontSize: '1em',
          }}
          icon={
            <img
              src={`/client-icons/${cellValues.row.clientId}.ico`}
              style={{ width: '15px', height: '15px', marginRight: '0.5em', marginTop: '0.2em' }}
              alt="icon "
            />
          }
          value={cellValues.row.nickName}
          sx={{ typography: 'caption' }}
        />
      ),
    },
    {
      field: 'accountType',
      headerName: translate('account_type'),
      minWidth: 90,
      width: 90,
      maxWidth: 200,
      flex: 0.8,
    },
    {
      field: 'volumeDay',
      headerName: translate('volume_day_sort'),
      minWidth: 100,
      width: 130,
      maxWidth: 200,
      renderCell: (cellValues) => (
        <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} color={'warning'}>
          {cellValues.row.volumeDay.toFixed(2)}$
        </Label>
      ),
    },
    {
      field: 'profitDay',
      headerName: translate('profit_day_sort'),
      minWidth: 100,
      width: 130,
      maxWidth: 200,
      renderCell: (cellValues) => (
        <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} color={'success'}>
          {cellValues.row.profitDay >= 0
            ? `+${parseFloat(cellValues.row.profitDay.toFixed(2))}`
            : parseFloat(cellValues.row.profitDay.toFixed(2))}{' '}
          $
        </Label>
      ),
    },
    {
      field: 'sponsor',
      headerName: translate('sponsor'),
      minWidth: 100,
      width: 100,
      maxWidth: 200,
      flex: 1,
    },

    {
      field: 'blockBtn',
      headerName: translate('actions'),
      minWidth: 100,
      width: 100,
      maxWidth: 200,
      renderCell: (cellValues) => (
        <Button
          variant={'contained'}
          onClick={() => {
            handleUnBlock(cellValues.row.nickName);
          }}
          color={'info'}
          size="small"
        >
          Bỏ chặn
        </Button>
      ),
    },
  ];

  return (
    <DataGrid
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
      disableSelectionOnClick
    />
  );
};

export default FollowersAction;
