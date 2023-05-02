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
  CircularProgress,
  TextField,
  Switch,
  FormControlLabel,
  ListItemText,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { DataGrid } from '@mui/x-data-grid';

import { React, useState, useEffect } from 'react';

// import { useParams, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { getMethodList } from 'src/redux/dashboard/account/action';
import useLocales from 'src/hooks2/useLocales';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { API_BOT } from 'src/apis';
import { FormProvider, RHFTextField } from 'src/component/hook-form';
import Iconify from 'src/component/Iconify';
import Label from 'src/component/Label';
import RHFSwitch from 'src/component/hook-form/RHFSwitch';

// components
// import { FormProvider, RHFTextField, RHFSwitch } from '../../../../components/hook-form';
// import Iconify from '../../../../components/Iconify';
// import MenuPopover from '../../../../components/MenuPopover';
// import Label from '../../../../components/Label';
// import { getMethodList } from '../../../../redux/dashboard/account/action';

// import useLocales from '../../../../hooks/useLocales';
// import { PATH_DASHBOARD } from '../../../../routes/paths';
// import { API_BOT } from '../../../../apis';

const Setting = () => {
  const navigate = useRouter();

  const { _id = '' } = navigate.query;

  const theme = useTheme();

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const getMethods = async () => {
    dispatch(await getMethodList());
  };
  const { translate } = useLocales();
  const [conditions, setConditions] = useState([]);

  const [isEdit, setIsEdit] = useState(false);
  const [currentIdEdit, setCurrentIdEdit] = useState(0);

  const CreateSettingSchema = Yup.object().shape({
    name: Yup.string().required(translate('please_enter_method_name')),
  });

  const defaultValues = {
    name: '',
    is_result: true,
    auto_sort_enabled: false,
  };

  const methods = useForm({
    resolver: yupResolver(CreateSettingSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    getValues,
    reset,
    watch,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = async (e) => {
    if (conditions.length === 0) {
      enqueueSnackbar(translate('please_add_at_least_1_condition'), { variant: 'error' });

      return;
    }

    const data = {
      name: e.name,
      type: 1,
      data: {
        is_result: e.is_result,
        auto_sort_enabled: e.auto_sort_enabled,
        conditions,
      },
    };

    const response = isEdit ? await API_BOT.updateMethod(currentIdEdit, data) : await API_BOT.createMethod(data);

    if (response.data.ok) {
      getMethods();
      enqueueSnackbar(translate('success'), { variant: 'success' });
      if (isEdit) {
        navigate.push(PATH_DASHBOARD.bot.method_management, { replace: true });
      }
      reset();

      return;
    }
    enqueueSnackbar(translate('failed'), { variant: 'error' });
  };

  const filterStr = ['b', 'B', 's', 'S', 'o', 'O', '?'];

  const checkFilter = (string) => {
    const current = { result: true };
    const array = string.split('');
    array.forEach((a) => {
      const find = filterStr.find((b) => b === a);
      if (!find) {
        current.result = false;
      }
    });

    return current.result;
  };

  const handleAddCondition = () => {
    const condition = getValues('condition')?.toLowerCase();

    if (condition?.split('-').length !== 2) {
      enqueueSnackbar(translate('this_condition_is_not_valid_chain'), { variant: 'error' });

      return;
    }

    const conditionArr = condition.split('-');

    const check1 = checkFilter(conditionArr[0]);
    const check2 = checkFilter(conditionArr[1]);
    if (check1 && check2) {
      if (condition) {
        const find = conditions.find((a) => a === condition);
        if (!find) setConditions([condition, ...conditions]);
        setValue('condition', '');
      }

      return;
    }

    enqueueSnackbar(translate('condition_contains_invalid_characters'), { variant: 'error' });
  };

  const handleDeleteConditions = (rmconditions) => {
    const current = { conditions: [...conditions] };
    rmconditions.forEach((condition) => {
      current.conditions = current.conditions.filter((a) => a !== condition);
    });
    setConditions(current.conditions);
  };

  const handleDeleteAllConditions = () => {
    setConditions([]);
  };

  useEffect(() => {
    if (_id !== '' && _id !== undefined) {
      setIsEdit(true);
      loadSettingId();
    }
  }, [_id]);

  const [isLoading, setLoading] = useState(false);

  const loadSettingId = async () => {
    setLoading(true);
    try {
      const response = await API_BOT.getMethodById(_id);

      if (response.data.ok === false) {
        navigate.push(PATH_DASHBOARD.bot.method_management);

        return;
      }
      if (response.data.ok) {
        const data = response.data.d;
        setCurrentIdEdit(data._id);

        // reset(data);

        setValue('name', data.name);
        setValue('condition', '');
        setValue('is_result', data.data.is_result);
        setValue('auto_sort_enabled', data.data.auto_sort_enabled || false);
        setConditions(data.data.conditions);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader title={translate('method_configuration')} />
        <CardContent>
          {isLoading ? (
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
              <CircularProgress />
            </Stack>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <RHFTextField name="name" label={translate('method_name')} size="small" />
              </Grid>
              <Grid item xs={8} md={8}>
                <RHFTextField name="condition" label={translate('condition')} size="small" />
              </Grid>
              <Grid item xs={4} md={4}>
                <Button
                  size={'small'}
                  startIcon={<Iconify icon={'carbon:add-filled'} />}
                  fullWidth
                  sx={{ height: '100%' }}
                  variant="contained"
                  onClick={handleAddCondition}
                >
                  {translate('add')}
                </Button>
              </Grid>
              <Grid item xs={12} md={12}>
                <RHFSwitch
                  name="is_result"
                  label={
                    <>
                      {translate('only_use_the_resulting_candle')}{' '}
                      <Label
                        variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                        color={values.is_result ? 'success' : 'error'}
                      >
                        {values.is_result ? translate('is_on') : translate('is_off')}
                      </Label>
                    </>
                  }
                  labelPlacement="end"
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <RHFSwitch
                  name="auto_sort_enabled"
                  label={
                    <>
                      {translate('auto_sort_random')}{' '}
                      <Label
                        variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                        color={values.auto_sort_enabled ? 'success' : 'error'}
                      >
                        {values.auto_sort_enabled ? translate('is_on') : translate('is_off')}
                      </Label>
                    </>
                  }
                  labelPlacement="end"
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography sx={{ fontSize: '0.8em', color: 'warning.main' }}>
                  {translate('guide_enter_chain')}
                </Typography>
              </Grid>

              <Grid item xs={12} md={12}>
                <ItemList
                  conditions={conditions}
                  handleDeleteConditions={handleDeleteConditions}
                  handleDeleteAllConditions={handleDeleteAllConditions}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <Button
                  size={'small'}
                  type="submit"
                  startIcon={<Iconify icon={'game-icons:confirmed'} />}
                  fullWidth
                  sx={{ height: '100%' }}
                  variant="contained"
                  color={isEdit ? 'warning' : 'primary'}
                >
                  {isEdit ? translate('edit') : translate('confirm')}
                </Button>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
    </FormProvider>
  );
};

const ItemList = ({ conditions, handleDeleteConditions, handleDeleteAllConditions }) => {
  const { translate } = useLocales();

  const [checked, setChecked] = useState([0]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleDelete = () => {
    handleDeleteConditions(checked);
  };

  const handleDeleteAll = () => {
    handleDeleteAllConditions();
  };

  return (
    <Card>
      <CardHeader
        title={translate('conditions_added')}
        action={
          <Stack spacing={1} direction="row">
            <Button
              startIcon={<Iconify icon={'fluent:delete-32-filled'} />}
              onClick={handleDelete}
              size="small"
              variant="contained"
              color="warning"
            >
              {translate('delete')}
            </Button>
            <Button
              startIcon={<Iconify icon={'entypo:trash'} />}
              onClick={handleDeleteAll}
              size="small"
              variant="contained"
              color="error"
            >
              {translate('delete_all')}
            </Button>
          </Stack>
        }
      />
      <CardContent>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {conditions.map((value) => {
            const labelId = `checkbox-list-label-${value}`;

            return (
              <ListItem key={value} disablePadding>
                <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.indexOf(value) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={value} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
};

export default Setting;
