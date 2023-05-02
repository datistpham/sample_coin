import { useState, useEffect, useCallback } from 'react';

import {
  Button,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  Checkbox,
  ListItemText,
  OutlinedInput,
  FormControl,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useLocales from 'src/hooks2/useLocales';
import LogMixDialog from './LogMixDialog';

// import useLocales from '../../../../hooks/useLocales';
// import LogMixDialog from './LogMixDialog';

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

const MixMode = ({ methods, isEdit, setValue, watch, canShowLogMix = true }) => {
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
    setValue('mix_methods_id', current.methodsId);
  };

  const values = watch();

  useEffect(() => {
    if (isEdit) {
      if (values.mix_methods_id && values.mix_methods_id.length > 0) {
        const current = { methodsName: [] };

        values.mix_methods_id.forEach((_id) => {
          const find = methods.find((a) => a._id === _id);
          if (find) {
            current.methodsName.push(find.name);
          }
        });

        setMethodsName(current.methodsName);
        setMethodsId(values.mix_methods_id);
      }
    }
  }, [methods]);

  const [isOpenLogMix, setOpenLogMix] = useState(false);

  return (
    <>
      <LogMixDialog isOpen={isOpenLogMix} setIsOpen={setOpenLogMix} botIds={methodsId} />
      <Grid container spacing={1}>
        <Grid item xs={canShowLogMix ? 9 : 12} md={canShowLogMix ? 10 : 12}>
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
        {canShowLogMix && (
          <Grid item xs={3} md={2}>
            <Button
              fullWidth
              sx={{ height: '100%' }}
              onClick={() => {
                setOpenLogMix(true);
              }}
              variant="contained"
              color="primary"
              size="small"
            >
              Log Mix
            </Button>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default MixMode;
