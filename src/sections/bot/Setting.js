import { useSnackbar } from 'notistack';
import { useState, useEffect, useCallback } from 'react';

import {
  Grid,
  Card,
  CardContent,
  Stack,
  Button,
  Typography,
  Box,
  Step,
  Stepper,
  StepLabel,
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { getBotList, getExchange } from 'src/redux/dashboard/account/action';
import useLocales from 'src/hooks2/useLocales';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { API_BOT } from 'src/apis';
import { CapitalManagementSetting, MethodSetting } from './settings';
import { FormProvider } from 'src/component/hook-form';
import Iconify from 'src/component/Iconify';

// import { useParams, useNavigate } from 'react-router-dom';
// import { FormProvider, RHFTextField } from '../../components/hook-form';
// import { getExchange, getBotList } from '../../redux/dashboard/account/action';
// import useIsMountedRef from '../../hooks/useIsMountedRef';

// // components

// import useLocales from '../../hooks/useLocales';
// import { CapitalManagementSetting, MethodSetting } from './settings';
// import { PATH_DASHBOARD } from '../../routes/paths';
// import Iconify from '../../components/Iconify';
// import { API_BOT } from '../../apis';

function Setting(props) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useRouter();
  const { _id = '' } = navigate.query;

  const dispatch = useDispatch();
  const exchangeAccounts = useSelector((state) => state.exchangeAccounts);

  const getExchangeAccount = async () => {
    dispatch(await getExchange());
  };
  useEffect(() => {
    if (!exchangeAccounts || (exchangeAccounts && exchangeAccounts.length === 0)) getExchangeAccount();

  }, [exchangeAccounts]);
  const { translate } = useLocales();

  const SettingSchema = Yup.object().shape({
    name: Yup.string().required(translate('bot_configuration_name_required')),
    linkAccountId: Yup.string().required(translate('this_is_required_information')),
    usability: Yup.number().required(translate('this_is_required_information')),
    capital_management: Yup.string().required(translate('this_is_required_information')),
    capital_management_type: Yup.number().required(translate('this_is_required_information')),
    bet_second: Yup.number().required(translate('this_is_required_information')),
  });

  const defaultValues = {
    name: '',
    linkAccountId: '',
    account_type: 'LIVE',
    usability: 0,
    capital_management: '1-2-4-8-17-35',
    capital_management_type: 0,
    bet_second: 20,
    increase_value_type: 0,
    take_profit_target: 0,
    stop_loss_target: 0,
    win_streak_target: 0,
    lose_streak_target: 0,
    win_total_target: 0,
    lose_total_target: 0,
    isNotificationsEnabled: true,
    isBrokerMode: false,
    teleBotId: '',
    fire_signal_enabled: false,
    fs_fire_x_sessions: 1,
    fs_in_x_session: 1,
    fs_skip_x_session: 0,
    fs_order_x_session: 1,
    reverse_enabled: false,
    method_id: '',
    mix_mode_enabled: false,
    auto_change_mode_enabled: false,
    autochange_wins: 0,
    autochange_losses: 0,
    autochange_win_streak: 0,
    autochange_loss_streak: 0,
    autochange_take_profit: 0,
    autochange_stop_loss: 0,
    not_stop_when_logged_out_enabled: false,
    not_turn_off_bot_when_not_enough_balance_enabled: false,
    wait_signal_from_other_bot_id: '',
    wait_signal_methods_id: [],
    wait_signal_from_other_bot_win_total: 0,
    wait_signal_from_other_bot_lose_total: 0,
    wait_signal_from_other_bot_win_streak: 0,
    wait_signal_from_other_bot_lose_streak: 0,
    wait_signal_from_other_bot_profit: 0,
    wait_signal_from_other_bot_loss: 0,
    wait_signal_from_other_bot_stop_win_total: 0,
    wait_signal_from_other_bot_stop_lose_total: 0,
    wait_signal_from_other_bot_stop_win_streak: 0,
    wait_signal_from_other_bot_stop_lose_streak: 0,
    wait_signal_from_other_bot_stop_profit: 0,
    wait_signal_from_other_bot_stop_loss: 0,
    wait_signal_from_other_start_when_exactly_enabled: false,
    wait_signal_from_other_get_stop_signal_based_on_navigation_bot_enabled: false,
    wait_signal_enabled: false,
    wait_signal_auto_sort_enabled: false,
    wait_signal_no_repeat_method_enabled: false,
    wait_signal_win_enabled: false,
    wait_signal_win_reverse_order_enabled: false,
    wait_signal_win_bet_at_end_streak: false,
    wait_signal_win_exact_numbers_wins: false,
    wait_signal_win_bet_at_win_streak: 1,
    wait_signal_win_bet_count: 1,
    wait_signal_win_change_method_when_lose_streak: 0,
    wait_signal_win_change_method_when_win_streak: 0,
    wait_signal_lose_enabled: false,
    wait_signal_lose_reverse_order_enabled: false,
    wait_signal_lose_bet_at_end_streak: false,
    wait_signal_lose_exact_numbers_loses: false,
    wait_signal_lose_bet_at_lose_streak: 1,
    wait_signal_lose_bet_count: 1,
    wait_signal_lose_change_method_when_lose_streak: 0,
    wait_signal_lose_change_method_when_win_streak: 0,
    wait_signal_victor_enabled: false,
    wait_signal_victor_reverse_order_enabled: false,
    wait_signal_victor_bet_at_end_streak: false,
    wait_signal_victor_exact_numbers_victors: false,
    wait_signal_victor_bet_at_victor_streak: 1,
    wait_signal_victor_bet_count: 1,
    wait_signal_victor_change_method_when_lose_streak: 0,
    wait_signal_victor_change_method_when_win_streak: 0,
    wait_signal_victor_change_method_when_victor_streak: 0,
    child_profit: false,
    child_profit_amount: 0,
    child_loss: false,
    child_loss_amount: 0,
    telegram_signal: false,
    telegram_signal_chatid: '',
    telegram_signal_token: '',
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

  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (_id !== '') {
      setEdit(true);
      getBotInfo();

      return;
    }
    navigate.push(PATH_DASHBOARD.bot.setting, { replace: true });
  }, [_id]);

  const createBot = async (data) => {
    const response = await API_BOT.createBot(data);

    if (response.data.ok) {
      getBots();
      setActiveStep(0);

      // reset();
      enqueueSnackbar(translate('success'), { variant: 'success' });
      handleReset();

      return;
    }
    enqueueSnackbar(translate('failed'), { variant: 'error' });
  };

  const updateBot = async (data) => {
    if (_id === '') {
      return;
    }
    const response = await API_BOT.updateBot(_id, data);

    if (response.data.ok) {
      setEdit(false);
      getBots();
      reset();
      enqueueSnackbar(translate('success'), { variant: 'success' });
      navigate.push(PATH_DASHBOARD.bot.setting, { replace: true });

      return;
    }
    enqueueSnackbar(translate(response.data.m), { variant: 'error' });
  };

  const [isLoading, setLoading] = useState(false);

  const getBotInfo = async () => {
    if (_id === '') {
      return;
    }
    setLoading(true);

    try {
      const response = await API_BOT.getBotInfo(_id);

      if (response.data.ok && response.data.d) {
        reset(response.data.d);

        return;
      }
      navigate.push(PATH_DASHBOARD.bot.setting);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e) => {
    if (activeStep === 0) {
      handleNext();

      return;
    }
    if (edit) {
      await updateBot(e);

      return;
    }
    await createBot(e);

  };

  const getBots = async () => {
    dispatch(await getBotList());
  };

  useEffect(() => {
    getBots();
  }, []);

  const values = watch();

  const steps = [
    {
      label: 'capital_management_configuration',
      component: <CapitalManagementSetting isEdit={edit} setValue={setValue} watch={watch} />,
    },
    {
      label: 'methods_configuration',
      component: <MethodSetting isEdit={edit} setValue={setValue} watch={watch} />,
    },
  ];

  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  const isStepOptional = (step) => step === 1;

  const isStepSkipped = (step) => skipped.has(step);

  const handleNext = async (e) => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);

      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={1}>
        <Grid item xs={12} md={12}>
          <Card>
            <CardContent>
              {isLoading ? (
                <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                  <CircularProgress />
                </Stack>
              ) : (
                <Box sx={{ width: '100%' }}>
                  {edit && (
                    <Stack direction="row" justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
                      <Typography variant={'subtitle2'} sx={{ color: 'primary.main' }}>
                        {translate('configuration_code')} : {values._id}
                      </Typography>
                    </Stack>
                  )}
                  <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((value, index) => {
                      const stepProps = {};
                      const labelProps = {};

                      if (isStepSkipped(index)) {
                        stepProps.completed = false;
                      }

                      return (
                        <Step key={value.label} {...stepProps}>
                          <StepLabel {...labelProps}>{translate(value.label)}</StepLabel>
                        </Step>
                      );
                    })}
                  </Stepper>
                  {activeStep === steps.length ? (
                    <>
                      <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleReset}>Reset</Button>
                      </Box>
                    </>
                  ) : (
                    <>
                      {steps[activeStep].component}
                      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                          variant={'contained'}
                          color="inherit"
                          disabled={activeStep === 0}
                          onClick={handleBack}
                          sx={{ mr: 1 }}
                          startIcon={<Iconify icon={'bx:arrow-back'} />}
                        >
                          Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />

                        {edit ? (
                          <Stack spacing={1} direction="row">
                            <Button
                              variant="contained"
                              color="error"
                              startIcon={<Iconify icon={'ic:outline-cancel'} />}
                              onClick={() => {
                                navigate.push(PATH_DASHBOARD.bot.setting);
                              }}
                            >
                              {translate('cancel')}
                            </Button>
                            <Button
                              startIcon={
                                <Iconify
                                  icon={
                                    activeStep < steps.length - 1 ? 'fluent:arrow-next-12-filled' : 'clarity:edit-solid'
                                  }
                                />
                              }
                              variant="contained"
                              color="warning"
                              type="submit"
                            >
                              {activeStep < steps.length - 1 ? translate('next') : translate('edit_configuration')}
                            </Button>
                          </Stack>
                        ) : (
                          <Button
                            startIcon={
                              <Iconify
                                icon={
                                  activeStep < steps.length - 1 ? 'fluent:arrow-next-12-filled' : 'carbon:add-filled'
                                }
                              />
                            }
                            variant="contained"
                            type="submit"
                          >
                            {activeStep < steps.length - 1 ? translate('next') : translate('add_configuration')}
                          </Button>
                        )}
                      </Box>
                    </>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default Setting;
