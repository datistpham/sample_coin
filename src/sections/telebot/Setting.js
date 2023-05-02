import { useSnackbar } from 'notistack';
import { useState, useEffect, useCallback } from 'react';

import { Grid, Card, CardContent, Stack, Button, Typography, Box, Step, Stepper, StepLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import useAuth from 'src/hooks2/useAuth';
import { useRouter } from 'next/router';
import { getExchange, getTeleBotList } from 'src/redux/dashboard/account/action';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { API_TELEBOT } from 'src/apis';
import useLocales from 'src/hooks2/useLocales';
import { CapitalManagementSetting, MethodSetting } from './settings';
import GrantBotDialog from './GrantBotDialog';
import { FormProvider } from 'src/component/hook-form';
import Iconify from 'src/component/Iconify';

function Setting(props) {
  const { user } = useAuth();

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
    usability: Yup.number().required(translate('this_is_required_information')),
    capital_management: Yup.string().required(translate('this_is_required_information')),
    capital_management_type: Yup.number().required(translate('this_is_required_information')),
    bet_second: Yup.number().required(translate('this_is_required_information')),
  });

  const defaultValues = {
    name: '',
    account_type: 'DEMO',
    usability: 0,
    capital_management: '1-2-4-8-17-35',
    capital_management_type: 0,
    bet_second: 25,
    increase_value_type: 0,
    take_profit_target: 0,
    stop_loss_target: 0,
    win_streak_target: 0,
    lose_streak_target: 0,
    win_total_target: 0,
    lose_total_target: 0,
    isNotificationsEnabled: true,
    isBrokerMode: false,
    telegramBotToken: '',
    telegramChatId: '',
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
    channel_url: '',
    get_bet_type_enabled: false,
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
    navigate.push(PATH_DASHBOARD.telebot.setting, { replace: true });
  }, [_id]);

  const createBot = async (data) => {
    const response = await API_TELEBOT.createBot(data);

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
    const response = await API_TELEBOT.updateBot(_id, data);

    if (response.data.ok) {
      setEdit(false);
      getBots();
      reset();
      enqueueSnackbar(translate('success'), { variant: 'success' });
      navigate.push(PATH_DASHBOARD.telebot.setting, { replace: true });

      return;
    }
    enqueueSnackbar(translate('failed'), { variant: 'error' });
  };

  const getBotInfo = async () => {
    if (_id === '') {
      return;
    }
    const response = await API_TELEBOT.getBotInfo(_id);

    if (response.data.ok && response.data.d) {
      delete response.data.teleData;
      delete response.data.lastData;

      reset(response.data.d);

      return;
    }
    navigate.push(PATH_DASHBOARD.telebot.setting);
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
    dispatch(await getTeleBotList());
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

  const [isOpenGrantBot, setOpenGrantBot] = useState(false);

  return (
    <>
      <GrantBotDialog isOpen={isOpenGrantBot} botInfo={values} setIsOpen={setOpenGrantBot} />

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={12}>
            <Card>
              <CardContent>
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
                                navigate.push(PATH_DASHBOARD.telebot.setting);
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
                          <Stack direction="row" spacing={1}>
                            {user.levelStaff >= 2 && (
                              <>
                                {user.levelStaff >= 3 && (
                                  <>
                                    {activeStep >= steps.length - 1 && !edit && (
                                      <Button
                                        startIcon={<Iconify icon={'fluent:bot-add-24-filled'} />}
                                        variant="contained"
                                        color="success"
                                        onClick={() => {
                                          setOpenGrantBot(true);
                                        }}
                                      >
                                        Cấp Bot
                                      </Button>
                                    )}
                                  </>
                                )}
                                <Button
                                  startIcon={
                                    <Iconify
                                      icon={
                                        activeStep < steps.length - 1
                                          ? 'fluent:arrow-next-12-filled'
                                          : 'carbon:add-filled'
                                      }
                                    />
                                  }
                                  variant="contained"
                                  type="submit"
                                >
                                  {activeStep < steps.length - 1 ? translate('next') : translate('add_configuration')}
                                </Button>
                              </>
                            )}
                          </Stack>
                        )}
                      </Box>
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}

export default Setting;
