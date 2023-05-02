import { useSnackbar } from 'notistack';

import { Stack, Card, CardContent, Button, Typography } from '@mui/material';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { useEffect, useState, useContext } from 'react';
import { SocketContext } from 'src/contexts/socketWeb';
import useLocales from 'src/hooks2/useLocales';
import { API_COPYTRADE } from 'src/apis';
import { FormProvider, RHFTextField } from 'src/component/hook-form';

// components


function ExpertBetForm(props) {
  const { enqueueSnackbar } = useSnackbar();
  const socket = useContext(SocketContext);

  const { translate } = useLocales();

  const BetSchema = Yup.object().shape({
    marginDense: Yup.number(translate('must_enter_number')).required(translate('this_is_required_information')),
  });

  const defaultValues = {
    marginDense: '1',
  };

  const methods = useForm({
    resolver: yupResolver(BetSchema),
    defaultValues,
  });

  const {
    getValues,
    reset,
    formState: { isSubmitting },
  } = methods;

  const handSendBetBtn = async (type) => {
    try {
      const obj = {
        marginDense: getValues('marginDense'),
        betType: type,
      };
      if (obj.linkAccountId === 1) {
        enqueueSnackbar(translate('trading_account_is_not_valid'), {
          variant: 'error',
        });

        return;
      }
      const response = await API_COPYTRADE.expertTrade(obj);

      if (response.status === 200) {
        const data = response.data;
        if (data.ok) {
          enqueueSnackbar(translate('submit_request_successfully'), {
            variant: 'success',
          });

          return;
        }
        enqueueSnackbar(data.message, {
          variant: 'error',
        });

        return;
      }

      // if (response.status === 401) {
      //   logout();
      // }
    } catch (e) {
      console.log(e);
    }
  };
  const [boPrice, setBoPrice] = useState({});
  const [isBetSession, setIsBetSession] = useState(false);

  const handleUpdateBoPrice = (data) => {
    setBoPrice(data);
    setIsBetSession(data.isBetSession);
  };

  useEffect(() => {
    socket.current.on('BO_PRICE', handleUpdateBoPrice);

    return () => socket.current.off('BO_PRICE', handleUpdateBoPrice);
  }, [socket]);

  return (
    <FormProvider methods={methods}>
      <Card>
        <CardContent>
          <Stack spacing={3} direction={{ xs: 'column', sm: 'column' }} sx={{ py: 2.5, px: 3 }}>
            <RHFTextField name="marginDense" label={translate('entry_coefficient')} size="small" />

            <Typography variant="caption" sx={{ textAlign: 'center', color: 'orange', fontSize: '1em' }}>
              {boPrice && boPrice.isBetSession
                ? `${translate('session')} ${boPrice.session ? boPrice.session : '0'} : ${translate('please_trade')} (${
                    boPrice.order ? boPrice.order : '0'
                  }s)`
                : `${translate('session')} ${boPrice.session ? boPrice.session : '0'} :  ${translate(
                    'waiting_result'
                  )}  (${boPrice.order ? boPrice.order : '0'}s)`}
            </Typography>
            <Stack spacing={1}>
              <Button
                disabled={!isBetSession}
                size="large"
                sx={{ width: '100%' }}
                color="success"
                onClick={() => {
                  handSendBetBtn('UP');
                }}
                variant="contained"
              >
                {translate('up').toUpperCase()}
              </Button>

              <Button
                disabled={!isBetSession}
                size="large"
                sx={{ width: '100%' }}
                color="error"
                onClick={() => {
                  handSendBetBtn('DOWN');
                }}
                variant="contained"
              >
                {translate('down').toUpperCase()}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </FormProvider>
  );
}

export default ExpertBetForm;
