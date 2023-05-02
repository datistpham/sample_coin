import { useSnackbar } from 'notistack';
import { useState, useEffect, useCallback } from 'react';

import {
  Grid,
  Card,
  CardContent,
  MenuItem,
  Stack,
  Button,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  ListItemText,
  Checkbox,
  OutlinedInput,
  CardHeader,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { getTeleBotList, getTeleBotTimerList } from 'src/redux/dashboard/account/action';
import useLocales from 'src/hooks2/useLocales';
import { API_TELEBOT } from 'src/apis';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { FormProvider, RHFTextField } from 'src/component/hook-form';
import Iconify from 'src/component/Iconify';

// import { useParams, useNavigate } from 'react-router-dom';

// import { FormProvider, RHFTextField } from '../../../components/hook-form';
// import { getTeleBotTimerList, getTeleBotList } from '../../../redux/dashboard/account/action';

// // components

// import useLocales from '../../../hooks/useLocales';
// import { PATH_DASHBOARD } from '../../../routes/paths';
// import Iconify from '../../../components/Iconify';
// import { API_TELEBOT } from '../../../apis';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function Setting(props) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useRouter();
  const { _id = '' } = navigate.query;

  const dispatch = useDispatch();

  const getTimerList = async () => {
    dispatch(await getTeleBotTimerList());
  };
  const { translate } = useLocales();

  const SettingSchema = Yup.object().shape({
    name: Yup.string().required(translate('this_is_required_information')),
    hour: Yup.number().required(translate('this_is_required_information')),
    minute: Yup.number().required(translate('this_is_required_information')),
    action_type: Yup.string().required(translate('this_is_required_information')),
  });

  const defaultValues = {
    name: '',
    hour: '10',
    minute: '00',
    action_type: 'start',
  };

  const methods = useForm({
    resolver: yupResolver(SettingSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (e) => {
    if (edit) {
      await updateTimer(e);

      return;
    }

    await createTimer(e);
  };

  const updateTimer = async (data) => {
    const response = await API_TELEBOT.updateTimer(_id, data);
    if (response.data.ok) {
      setEdit(false);
      getTimerList();
      reset();
      enqueueSnackbar(translate('success'), { variant: 'success' });
      navigate.push(PATH_DASHBOARD.telebot.timer, { replace: true });

      return;
    }
    enqueueSnackbar(translate(response.data.m), { variant: 'error' });
  };

  const createTimer = async (data) => {
    const response = await API_TELEBOT.addTimer(data);
    if (response.data.ok) {
      // reset();
      getTimerList();
      enqueueSnackbar(translate('success'), { variant: 'success' });

      return;
    }
    enqueueSnackbar(translate(response.data.m), { variant: 'error' });
  };

  const getBots = async () => {
    dispatch(await getTeleBotList());
  };

  const botList = useSelector((state) => state.teleBotList);

  useEffect(() => {
    getBots();
  }, []);

  const [methodsName, setMethodsName] = useState([]);
  const [methodsId, setMethodsId] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    const current = { methodsName: [], methodsId: [] };

    value.forEach((_id) => {
      const find = botList.find((a) => a._id === _id);
      if (find) {
        current.methodsName.push(find.name);
        current.methodsId.push(_id);
      }
    });

    setMethodsName(current.methodsName);
    setMethodsId(current.methodsId);
    setValue('bot_ids', current.methodsId);
  };

  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (_id !== '') {
      setEdit(true);
      getTimerInfo();

      return;
    }
    navigate.push(PATH_DASHBOARD.telebot.timer, { replace: true });
  }, [_id]);

  const [isLoading, setLoading] = useState(false);

  const getTimerInfo = async () => {
    if (_id === '') {
      return;
    }
    setLoading(true);

    try {
      const response = await API_TELEBOT.getTimerById(_id);

      if (response.data.ok && response.data.d) {
        reset(response.data.d);

        return;
      }
      navigate.push(PATH_DASHBOARD.telebot.setting);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const values = watch();
  useEffect(() => {
    if (edit) {
      if (values.bot_ids && values.bot_ids.length > 0) {
        const current = { methodsName: [] };

        values.bot_ids.forEach((_id) => {
          const find = botList.find((a) => a._id === _id);
          if (find) {
            current.methodsName.push(find.name);
          }
        });

        setMethodsName(current.methodsName);
        setMethodsId(values.bot_ids);
      }
    }
  }, [botList, _id, values.bot_ids]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={1}>
        <Grid item xs={12} md={12}>
          <Card>
            <CardHeader title={translate('add_timer_configuration')} />
            <CardContent>
              {isLoading ? (
                <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                  <CircularProgress />
                </Stack>
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={6} md={6}>
                    <RHFTextField name="name" label={translate('configuration_name')} size="small" />
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <RHFTextField
                      size="small"
                      fullWidth
                      select
                      name="action_type"
                      label={translate('actions')}
                      SelectProps={{
                        MenuProps: {
                          sx: { '& .MuiPaper-root': { maxHeight: 260 } },
                        },
                      }}
                      sx={{
                        maxWidth: { sm: '100%' },
                        textTransform: 'capitalize',
                      }}
                    >
                      <MenuItem
                        key="start"
                        checked
                        value="start"
                        sx={{
                          mx: 1,
                          my: 0.5,
                          borderRadius: 0.75,
                          typography: 'body2',
                          textTransform: 'capitalize',
                        }}
                      >
                        {translate('start')}
                      </MenuItem>
                      <MenuItem
                        key="stop"
                        checked
                        value="stop"
                        sx={{
                          mx: 1,
                          my: 0.5,
                          borderRadius: 0.75,
                          typography: 'body2',
                          textTransform: 'capitalize',
                        }}
                      >
                        {translate('stop')}
                      </MenuItem>
                    </RHFTextField>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <RHFTextField name="hour" label={`${translate('hour')} (0->23)`} size="small" />
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <RHFTextField name="minute" label={`${translate('minute')} (0->59)`} size="small" />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <FormControl sx={{ width: '100%' }}>
                      <InputLabel id="demo-multiple-checkbox-label">{translate('use_configurations')}</InputLabel>
                      <Select
                        size="small"
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={methodsId}
                        onChange={handleChange}
                        input={<OutlinedInput label={translate('use_configurations')} />}
                        renderValue={(selected) => methodsName.join(', ')}
                        MenuProps={MenuProps}
                      >
                        {botList.map((method) => (
                          <MenuItem key={method.name} value={method._id}>
                            <Checkbox checked={methodsId.indexOf(method._id) > -1} />
                            <ListItemText primary={method.name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Typography sx={{ color: 'warning.main' }}>{translate('note_timer')}</Typography>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Button
                      startIcon={<Iconify icon={edit ? 'entypo:edit' : 'bxs:alarm-add'} />}
                      type="submit"
                      variant="contained"
                      color={edit ? 'warning' : 'primary'}
                      fullWidth
                    >
                      {translate(edit ? 'edit_configuration' : 'add_configuration')}
                    </Button>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default Setting;
