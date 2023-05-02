import { useState, useEffect, useCallback } from 'react';

import {
  Grid,
  Select,
  MenuItem,
  InputLabel,
  Checkbox,
  ListItemText,
  OutlinedInput,
  FormControl,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useLocales from 'src/hooks2/useLocales';
import { RHFTextField } from 'src/component/hook-form';


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

const AutoChangeMode = ({ methods, isEdit, setValue, watch }) => {
  const { translate } = useLocales();
  const [methodsName, setMethodsName] = useState([]);
  const [methodsId, setMethodsId] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    const current = { methodsName: [], methodsId: [] };

    value.forEach((_id) => {
      const find = methods.find((a) => a._id === _id);
      if (find) {
        current.methodsName.push(find.name);
        current.methodsId.push(_id);
      }
    });

    setMethodsName(current.methodsName);
    setMethodsId(current.methodsId);
    setValue('auto_change_methods_id', current.methodsId);
  };

  const values = watch();

  useEffect(() => {
    if (isEdit) {
      if (values.auto_change_methods_id && values.auto_change_methods_id.length > 0) {
        const current = { methodsName: [] };

        values.auto_change_methods_id.forEach((_id) => {
          const find = methods.find((a) => a._id === _id);
          if (find) {
            current.methodsName.push(find.name);
          }
        });

        setMethodsName(current.methodsName);
        setMethodsId(values.auto_change_methods_id);
        setValue('auto_change_methods_id', values.auto_change_methods_id);
      }
    }
  }, [methods]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <FormControl sx={{ width: '100%' }}>
          <InputLabel id="demo-multiple-checkbox-label">{translate('use_methods')}</InputLabel>
          <Select
            size="small"
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={methodsId}
            onChange={handleChange}
            input={<OutlinedInput label={translate('use_methods')} />}
            renderValue={(selected) => methodsName.join(', ')}
            MenuProps={MenuProps}
          >
            {methods.map((method) => (
              <MenuItem key={method.name} value={method._id}>
                <Checkbox checked={methodsId.indexOf(method._id) > -1} />
                <ListItemText primary={method.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={6} md={6}>
        <RHFTextField name="autochange_wins" type={'number'} label={translate('change_when_win_total')} size="small" />
      </Grid>
      <Grid item xs={6} md={6}>
        <RHFTextField
          name="autochange_losses"
          type={'number'}
          label={translate('change_when_lose_total')}
          size="small"
        />
      </Grid>

      <Grid item xs={6} md={6}>
        <RHFTextField
          name="autochange_win_streak"
          type={'number'}
          label={translate('change_when_win_streak')}
          size="small"
        />
      </Grid>
      <Grid item xs={6} md={6}>
        <RHFTextField
          name="autochange_loss_streak"
          type={'number'}
          label={translate('change_when_lose_streak')}
          size="small"
        />
      </Grid>
      <Grid item xs={6} md={6}>
        <RHFTextField
          name="autochange_take_profit"
          type={'text'}
          label={translate('change_when_profit')}
          size="small"
        />
      </Grid>
      <Grid item xs={6} md={6}>
        <RHFTextField name="autochange_stop_loss" type={'text'} label={translate('change_when_loss')} size="small" />
      </Grid>

      <Grid item xs={12} md={12}>
        <Typography sx={{ color: 'warning.main' }}>
          {translate('note')}: {translate('unused_targets_enter_0')}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default AutoChangeMode;
