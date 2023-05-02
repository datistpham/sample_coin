import { useSnackbar } from 'notistack';
import { useState, useEffect, useCallback } from 'react';

import {
  Card,
  Select,
  Stack,
  MenuItem,
  InputLabel,
  CardContent,
  FormControl,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useLocales from 'src/hooks2/useLocales';
import useIsMountedRef from 'src/hooks2/useIsMountedRef';
import { API_COPYTRADE } from 'src/apis';
import SettingCPTItem from './SettingCPTItem';
import Label from 'src/component/Label';


// components


function SettingDetails({ linkAccountId }) {
  const { translate } = useLocales();
  const isMountedRef = useIsMountedRef();

  const theme = useTheme();

  const [listSetting, setListSetting] = useState([]);

  const [isLoading, setLoading] = useState(false);

  const getListSetting = useCallback(async () => {
    setLoading(true);
    try {
      if (linkAccountId === undefined || !linkAccountId) {
        return;
      }
      const response = await API_COPYTRADE.getListConfiguration(linkAccountId);
      if (isMountedRef.current) {
        if (response.data.ok && response.data.d && response.data.d.length > 0) {
          setListSetting(response.data.d);
          setSettingSelected(response.data.d[0]._id);
          const findSetting = response.data.d[0];
          if (findSetting) {
            setSettingInfo(findSetting);
          }

          return;
        }

        setListSetting([]);
        setSettingInfo({
          nickName: '',
          accountType: '',
          stopLossTarget: 0,
          takeProfitTarget: 0,
          brokerUsername: '',
          clientId: '',
          isActive: false,
          moneyPerOrder: 0,
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [isMountedRef, linkAccountId]);

  useEffect(() => {
    getListSetting();
  }, [linkAccountId]);

  const [settingSelected, setSettingSelected] = useState('');

  const [settingInfo, setSettingInfo] = useState({
    nickName: '',
    accountType: '',
    stopLossTarget: 0,
    takeProfitTarget: 0,
    brokerUsername: '',
    clientId: '',
    isActive: false,
    moneyPerOrder: 0,
  });

  const handleChangeSetting = (e) => {
    setSettingSelected(e.target.value);
    const findSetting = listSetting.find((a) => a._id === e.target.value);
    if (findSetting) {
      setSettingInfo(findSetting);
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={4}>
          <SettingCPTItem
            icon="ic:baseline-cloud-done"
            title={``}
            content={
              isLoading ? (
                <CircularProgress size={12} />
              ) : (
                <FormControl sx={{ width: '50%' }}>
                  <InputLabel id="demo-simple-select-label">{translate('broker_username')}</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    size="small"
                    value={settingSelected}
                    onChange={handleChangeSetting}
                    label={translate('broker_username')}
                  >
                    {listSetting.map((setting) => (
                      <MenuItem key={setting._id} value={setting._id}>
                        {setting.brokerUserName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )
            }
          />
          <SettingCPTItem
            icon="ic:baseline-account-balance-wallet"
            title={translate('account_type')}
            content={isLoading ? <CircularProgress size={12} /> : settingInfo.accountType}
          />

          <SettingCPTItem
            icon="bxs:badge-dollar"
            title={translate('money_per_order')}
            content={isLoading ? <CircularProgress size={12} /> : `${settingInfo.moneyPerOrder} $`}
          />
          <SettingCPTItem
            icon="fluent:target-arrow-24-filled"
            title={translate('take_profit_target')}
            content={
              (isLoading && <CircularProgress size={12} />) || settingInfo.takeProfitTarget === 0 ? (
                <Typography sx={{ color: 'warning.main', fontSize: '1em', fontWeight: 'bold' }}>
                  {translate('dont_use')}
                </Typography>
              ) : (
                `${settingInfo.takeProfitTarget} $`
              )
            }
          />
          <SettingCPTItem
            icon="tabler:target-off"
            title={translate('stop_loss_target')}
            content={
              (isLoading && <CircularProgress size={12} />) || settingInfo.stopLossTarget === 0 ? (
                <Typography sx={{ color: 'error.main', fontSize: '1em', fontWeight: 'bold' }}>
                  {translate('dont_use')}
                </Typography>
              ) : (
                `${settingInfo.stopLossTarget} $`
              )
            }
          />

          <SettingCPTItem
            icon="simple-icons:statuspal"
            title={translate('status')}
            content={
              isLoading ? (
                <CircularProgress size={12} />
              ) : (
                <Label
                  variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                  color={settingInfo.isActive ? 'success' : 'error'}
                >
                  {settingInfo.isActive ? translate('is_on') : translate('is_off')}
                </Label>
              )
            }
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

export default SettingDetails;
