import { useState, useEffect } from 'react';

import { Grid, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { useSelector, useDispatch } from 'react-redux';

// import { RHFTextField } from '../../../../components/hook-form';
// import { getMethodList } from '../../../../redux/dashboard/account/action';

// import useLocales from '../../../../hooks/useLocales';
import MixMode from './MixMode';
import AutoChangeMode from './AutoChangeMode';
import { getMethodList } from 'src/redux/dashboard/account/action';
import useLocales from 'src/hooks2/useLocales';
import { RHFTextField } from 'src/component/hook-form';

const ADVANCED_FEATURES = [
  { id: 1, key: 'mix_mode_enabled', name: 'mix_methods_mode' },
  { id: 2, key: 'auto_change_mode_enabled', name: 'auto_change_methods_mode' },
];

const PersonalMethods = ({ watch, setValue, isEdit }) => {
  const { translate } = useLocales();
  const theme = useTheme();
  const dispatch = useDispatch();

  const methods = useSelector((state) => state.methodList);

  const getMethods = async () => {
    dispatch(await getMethodList());
  };

  useEffect(() => {
    getMethods();
  }, []);

  const values = watch();

  useEffect(() => {}, [values]);

  useEffect(() => {
    if (values.auto_change_mode_enabled) {
      setAdvanceFuture(2);
    }
  }, [values.auto_change_mode_enabled]);

  useEffect(() => {
    if (values.mix_mode_enabled) {
      setAdvanceFuture(1);
    }
  }, [values.mix_mode_enabled]);

  const [advanceFeature, setAdvanceFuture] = useState(0);

  const handleChangeAdvanceFeature = (e) => {
    try {
      setAdvanceFuture(e.target.value);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    ADVANCED_FEATURES.forEach((feature) => {
      if (feature.id === advanceFeature) {
        setValue(feature.key, true);
      }
      if (feature.id !== advanceFeature) {
        setValue(feature.key, false);
      }
    });
  }, [advanceFeature]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <FormControl sx={{ width: '100%' }}>
          <InputLabel id="demo-simple-select-label">{translate('advanced_feature')}</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            size="small"
            value={advanceFeature}
            onChange={handleChangeAdvanceFeature}
            label={translate('advanced_feature')}
          >
            <MenuItem key={0} value={0}>
              {translate('not_use')}
            </MenuItem>
            {ADVANCED_FEATURES.map((feature) => (
              <MenuItem key={feature.id} value={feature.id}>
                {translate(feature.name)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={12}>
        {values.mix_mode_enabled || values.auto_change_mode_enabled ? (
          (values.mix_mode_enabled && (
            <Grid item xs={12} md={12}>
              <MixMode methods={methods} setValue={setValue} watch={watch} isEdit={isEdit} canShowLogMix={false} />
            </Grid>
          )) ||
          (values.auto_change_mode_enabled && (
            <Grid item xs={12} md={12}>
              <AutoChangeMode methods={methods} setValue={setValue} watch={watch} isEdit={isEdit} />
            </Grid>
          ))
        ) : (
          <RHFTextField
            size="small"
            fullWidth
            select
            name="method_id"
            label={translate('method_name')}
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
            {methods.map((option) => (
              <MenuItem key={option._id} value={option._id}>
                {translate(option.name)}
              </MenuItem>
            ))}
          </RHFTextField>
        )}
      </Grid>
    </Grid>
  );
};

export default PersonalMethods;
