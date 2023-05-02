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
  ListItemText,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  Typography,
  Badge,
  Box,
  CircularProgress,
} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';

import { DataGrid } from '@mui/x-data-grid';

import { React, useState, useEffect } from 'react';

// import { useParams, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { useSelector, useDispatch } from 'react-redux';

// components
// import { FormProvider, RHFTextField, RHFSwitch } from '../../../../components/hook-form';
// import Iconify from '../../../../components/Iconify';
// import MenuPopover from '../../../../components/MenuPopover';
// import Label from '../../../../components/Label';
// import { getMethodList } from '../../../../redux/dashboard/account/action';

// import useLocales from '../../../../hooks/useLocales';
// import { PATH_DASHBOARD } from '../../../../routes/paths';
// import { API_BOT } from '../../../../apis';
import OptionDialog from './OptionDialog';
import { useRouter } from 'next/router';
import { getMethodList } from 'src/redux/dashboard/account/action';
import useLocales from 'src/hooks2/useLocales';
import { API_BOT } from 'src/apis';
import { FormProvider, RHFTextField } from 'src/component/hook-form';
import { PATH_DASHBOARD } from 'src/routes/paths';
import Iconify from 'src/component/Iconify';

const shapeStyles = { width: 40, height: 40 };
const shapeCircleStyles = { borderRadius: '50%' };
const rectangle = <Box component="span" sx={shapeStyles} />;

const Bubble = ({ number, bgcolor = 'primary.main', textcolor = 'warning.main' }) => (
  <Box component="span" sx={{ bgcolor, ...shapeStyles, ...shapeCircleStyles }}>
    <Typography sx={{ mt: '25%', color: textcolor }}>{number}</Typography>
  </Box>
);

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
    if (!conditions || (conditions && conditions.length === 0)) {
      enqueueSnackbar(translate('please_add_at_least_1_condition'), { variant: 'error' });

      return;
    }

    const data = {
      name: e.name,
      type: 2,
      data: {
        conditions,
      },
    };

    const response = isEdit ? await API_BOT.updateMethod(currentIdEdit, data) : await API_BOT.createMethod(data);
    if (response.data.ok) {
      getMethods();
      enqueueSnackbar(translate('success'), { variant: 'success' });
      if (isEdit) {
        navigate.push(`${PATH_DASHBOARD.bot.method_management}/#bubble`);
      }

      // setCurrentIdEdit(0);
      // setIsEdit(false);
      // setConditions([]);
      reset();

      return;
    }
    enqueueSnackbar(translate('failed'), { variant: 'error' });
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
        navigate.push(`${PATH_DASHBOARD.bot.method_management}/#bubble`);

        return;
      }
      if (response.data.ok) {
        const data = response.data.d;

        setCurrentIdEdit(data._id);
        setValue('name', data.name);
        setConditions(data.data.conditions);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const [isOpenOption, setIsOpenOption] = useState(false);
  const [numberOption, setNumberOption] = useState(0);
  const [isEditOption, setIsEditOption] = useState(false);
  const [indexEditOption, setIndexEditOption] = useState(0);
  const [dataEditOption, setDataEditOption] = useState({});

  const addBubbleOption = (number) => {
    setNumberOption(number);
    setIsEditOption(false);
    setDataEditOption({});
    setIsOpenOption(true);
  };

  const addCondition = (data) => {
    try {
      const { bubble, betType } = data;
      const childConditions = data.conditions;
      const newArr = [{ bubble, betType, conditions: childConditions, time: new Date().getTime() }, ...conditions];

      setConditions(newArr);

      setIsOpenOption(false);

      enqueueSnackbar(translate('success'), { variant: 'success' });
    } catch (e) {
      console.log(e);
    }
  };

  const deleteCondition = (time) => {
    setConditions(conditions.filter((a) => a.time !== time));
  };

  const editCondition = (index, data) => {
    try {
      const newArr = [...conditions];
      const { bubble, betType } = data;
      const childConditions = data.conditions;

      newArr[index] = { bubble, betType, conditions: childConditions };

      setConditions(newArr);

      setIsOpenOption(false);

      enqueueSnackbar(translate('success'), { variant: 'success' });
    } catch (e) {
      console.log(e);
    }
  };

  const openEditCondition = (key, data) => {
    setNumberOption(data.bubble);
    setIsEditOption(true);
    setDataEditOption(data);
    setIndexEditOption(key);
    setIsOpenOption(true);
  };

  return (
    <>
      <OptionDialog
        isOpen={isOpenOption}
        setIsOpen={setIsOpenOption}
        number={numberOption}
        isEdit={isEditOption}
        data={dataEditOption}
        indexEdit={indexEditOption}
        submitAddCondition={addCondition}
        submitEditCondition={editCondition}
        submitDeleteCondition={deleteCondition}
      />
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
                <Grid item xs={12} md={12}>
                  <Card>
                    <CardHeader title={translate('select_1_bubble_you_want_to_add')} />
                    <CardContent>
                      <Grid container spacing={1} direction="column" alignItems="center" justifyContent="center">
                        <Grid item xs={10} md={10}>
                          <Grid container spacing={3}>
                            <Grid item xs={2} md={2}>
                              <IconButton
                                aria-label="cart"
                                onClick={() => {
                                  addBubbleOption(1);
                                }}
                              >
                                <Badge
                                  color="warning"
                                  overlap="circular"
                                  badgeContent={
                                    conditions.filter((a) => a.bubble === 1).length > 0
                                      ? conditions.filter((a) => a.bubble === 1).length
                                      : '0'
                                  }
                                >
                                  <Bubble number={1} />
                                </Badge>
                              </IconButton>
                            </Grid>
                            <Grid item xs={2} md={2}>
                              <IconButton
                                aria-label="cart"
                                onClick={() => {
                                  addBubbleOption(5);
                                }}
                              >
                                <Badge
                                  color="warning"
                                  overlap="circular"
                                  badgeContent={
                                    conditions.filter((a) => a.bubble === 5).length > 0
                                      ? conditions.filter((a) => a.bubble === 5).length
                                      : '0'
                                  }
                                >
                                  <Bubble number={5} />
                                </Badge>
                              </IconButton>
                            </Grid>
                            <Grid item xs={2} md={2}>
                              <IconButton
                                aria-label="cart"
                                onClick={() => {
                                  addBubbleOption(9);
                                }}
                              >
                                <Badge
                                  color="warning"
                                  overlap="circular"
                                  badgeContent={
                                    conditions.filter((a) => a.bubble === 9).length > 0
                                      ? conditions.filter((a) => a.bubble === 9).length
                                      : '0'
                                  }
                                >
                                  <Bubble number={9} />
                                </Badge>
                              </IconButton>
                            </Grid>
                            <Grid item xs={2} md={2}>
                              <IconButton
                                aria-label="cart"
                                onClick={() => {
                                  addBubbleOption(13);
                                }}
                              >
                                <Badge
                                  color="warning"
                                  overlap="circular"
                                  badgeContent={
                                    conditions.filter((a) => a.bubble === 13).length > 0
                                      ? conditions.filter((a) => a.bubble === 13).length
                                      : '0'
                                  }
                                >
                                  <Bubble number={13} />
                                </Badge>
                              </IconButton>
                            </Grid>
                            <Grid item xs={2} md={2}>
                              <IconButton
                                aria-label="cart"
                                onClick={() => {
                                  addBubbleOption(17);
                                }}
                              >
                                <Badge
                                  color="warning"
                                  overlap="circular"
                                  badgeContent={
                                    conditions.filter((a) => a.bubble === 17).length > 0
                                      ? conditions.filter((a) => a.bubble === 17).length
                                      : '0'
                                  }
                                >
                                  <Bubble number={17} />
                                </Badge>
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={10} md={10}>
                          <Grid container spacing={3}>
                            <Grid item xs={2} md={2}>
                              <IconButton disabled aria-label="cart">
                                <Badge color="warning" overlap="circular">
                                  <Bubble bgcolor="#36454F" number={2} />
                                </Badge>
                              </IconButton>
                            </Grid>
                            <Grid item xs={2} md={2}>
                              <IconButton disabled aria-label="cart">
                                <Badge color="warning" overlap="circular">
                                  <Bubble bgcolor="#36454F" number={6} />
                                </Badge>
                              </IconButton>
                            </Grid>
                            <Grid item xs={2} md={2}>
                              <IconButton disabled aria-label="cart">
                                <Badge color="warning" overlap="circular">
                                  <Bubble bgcolor="#36454F" number={10} />
                                </Badge>
                              </IconButton>
                            </Grid>
                            <Grid item xs={2} md={2}>
                              <IconButton disabled aria-label="cart">
                                <Badge color="warning" overlap="circular">
                                  <Bubble bgcolor="#36454F" number={14} />
                                </Badge>
                              </IconButton>
                            </Grid>
                            <Grid item xs={2} md={2}>
                              <IconButton disabled aria-label="cart">
                                <Badge color="warning" overlap="circular">
                                  <Bubble bgcolor="#36454F" number={18} />
                                </Badge>
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={10} md={10}>
                          <Grid container spacing={3}>
                            <Grid item xs={2} md={2}>
                              <IconButton
                                aria-label="cart"
                                onClick={() => {
                                  addBubbleOption(3);
                                }}
                              >
                                <Badge
                                  color="warning"
                                  overlap="circular"
                                  badgeContent={
                                    conditions.filter((a) => a.bubble === 3).length > 0
                                      ? conditions.filter((a) => a.bubble === 3).length
                                      : '0'
                                  }
                                >
                                  <Bubble number={3} />
                                </Badge>
                              </IconButton>
                            </Grid>
                            <Grid item xs={2} md={2}>
                              <IconButton
                                aria-label="cart"
                                onClick={() => {
                                  addBubbleOption(7);
                                }}
                              >
                                <Badge
                                  color="warning"
                                  overlap="circular"
                                  badgeContent={
                                    conditions.filter((a) => a.bubble === 7).length > 0
                                      ? conditions.filter((a) => a.bubble === 7).length
                                      : '0'
                                  }
                                >
                                  <Bubble number={7} />
                                </Badge>
                              </IconButton>
                            </Grid>
                            <Grid item xs={2} md={2}>
                              <IconButton
                                aria-label="cart"
                                onClick={() => {
                                  addBubbleOption(11);
                                }}
                              >
                                <Badge
                                  color="warning"
                                  overlap="circular"
                                  badgeContent={
                                    conditions.filter((a) => a.bubble === 11).length > 0
                                      ? conditions.filter((a) => a.bubble === 11).length
                                      : '0'
                                  }
                                >
                                  <Bubble number={11} />
                                </Badge>
                              </IconButton>
                            </Grid>
                            <Grid item xs={2} md={2}>
                              <IconButton
                                aria-label="cart"
                                onClick={() => {
                                  addBubbleOption(15);
                                }}
                              >
                                <Badge
                                  color="warning"
                                  overlap="circular"
                                  badgeContent={
                                    conditions.filter((a) => a.bubble === 15).length > 0
                                      ? conditions.filter((a) => a.bubble === 15).length
                                      : '0'
                                  }
                                >
                                  <Bubble number={15} />
                                </Badge>
                              </IconButton>
                            </Grid>
                            <Grid item xs={2} md={2}>
                              <IconButton
                                aria-label="cart"
                                onClick={() => {
                                  addBubbleOption(19);
                                }}
                              >
                                <Badge
                                  color="warning"
                                  overlap="circular"
                                  badgeContent={
                                    conditions.filter((a) => a.bubble === 19).length > 0
                                      ? conditions.filter((a) => a.bubble === 19).length
                                      : '0'
                                  }
                                >
                                  <Bubble number={19} />
                                </Badge>
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={10} md={10}>
                          <Grid container spacing={3}>
                            <Grid item xs={2} md={2}>
                              <IconButton disabled aria-label="cart">
                                <Badge color="warning" overlap="circular">
                                  <Bubble bgcolor="#36454F" number={4} />
                                </Badge>
                              </IconButton>
                            </Grid>
                            <Grid item xs={2} md={2}>
                              <IconButton disabled aria-label="cart">
                                <Badge color="warning" overlap="circular">
                                  <Bubble bgcolor="#36454F" number={8} />
                                </Badge>
                              </IconButton>
                            </Grid>
                            <Grid item xs={2} md={2}>
                              <IconButton disabled aria-label="cart">
                                <Badge color="warning" overlap="circular">
                                  <Bubble bgcolor="#36454F" number={12} />
                                </Badge>
                              </IconButton>
                            </Grid>
                            <Grid item xs={2} md={2}>
                              <IconButton disabled aria-label="cart">
                                <Badge color="warning" overlap="circular">
                                  <Bubble bgcolor="#36454F" number={16} />
                                </Badge>
                              </IconButton>
                            </Grid>
                            <Grid item xs={2} md={2}>
                              <IconButton disabled aria-label="cart">
                                <Badge color="warning" overlap="circular">
                                  <Bubble bgcolor="#36454F" number={20} />
                                </Badge>
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={12}>
                  <ItemList
                    conditions={conditions}
                    handleDeleteAllConditions={handleDeleteAllConditions}
                    editCondition={openEditCondition}
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
    </>
  );
};

const ItemList = ({ conditions, handleDeleteConditions, handleDeleteAllConditions, editCondition }) => {
  const { translate } = useLocales();

  const handleDeleteAll = () => {
    handleDeleteAllConditions();
  };

  const handleEdit = (key, data) => {
    editCondition(key, data);
  };

  return (
    <Card>
      <CardHeader
        title={translate('conditions_added')}
        action={
          <Stack spacing={1} direction="row">
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
        <Grid container spacing={1}>
          {conditions.map((value, index) => {
            const current = { color: 'info.main', textcolor: 'black' };

            if (value.betType === 1) {
              current.color = 'success.main';
              current.textcolor = 'black';
            }
            if (value.betType === 0) {
              current.color = 'error.main';
              current.textcolor = 'white';
            }

            return (
              <Grid item xs={3} md={2} key={index}>
                <IconButton
                  aria-label="cart"
                  onClick={() => {
                    handleEdit(index, value);
                  }}
                >
                  <Badge color="primary" overlap="circular" badgeContent={value.conditions.length}>
                    <Bubble number={value.bubble} bgcolor={current.color} textcolor={current.textcolor} />
                  </Badge>
                </IconButton>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Setting;
