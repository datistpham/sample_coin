import { useSnackbar } from 'notistack';

import { Card, MenuItem, Stack, CardHeader, CardContent, Typography, Divider, Link } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { DataGrid } from '@mui/x-data-grid';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import useLocales from 'src/hooks2/useLocales';

function Overview({ data }) {
  const { translate } = useLocales();
  if (data.nn === undefined || data.nn.length < 1) return <></>;

  return (
    <Card>
      <CardHeader title={translate('exchange_account_info')} />
      <CardContent>
        <Stack spacing={1}>
          <Typography>
            {translate('nickname')} : {data.nn}
          </Typography>
          <Typography>
            {translate('sponsor')} : {data.sponsor || ''}
          </Typography>
          <Typography>
            {translate('rank')} : {data.rank}
          </Typography>
          <Typography>
            {translate('F1 Agencies')} : {data.f1_agencies}/{data.upnextrank_agencies}
          </Typography>
          <Typography>
            {translate('F1 Volume')} : {parseFloat(data.current_week_f1_vol.toFixed(2))}/
            {data.current_week_f1_nextrankvol}
          </Typography>

          <Typography>
            {translate('Referal URL')} :{' '}
            <Link href={data.ref_url} target="_blank" underline="hover">
              {data.ref_url}
            </Link>
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default Overview;
