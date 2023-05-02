import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

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
  Box,
  Tab,
  Tabs,
  Card,
  CardContent,
  Divider,
} from '@mui/material';

import { useTheme } from '@mui/material/styles';
import useLocales from 'src/hooks2/useLocales';
import { RHFCheckbox, RHFTextField } from 'src/component/hook-form';
import useTabs from 'src/hooks2/useTabs';

// import useTabs from '../../../../hooks/useTabs';
// import Iconify from '../../../../components/Iconify';

// import { RHFTextField, RHFSwitch, RHFCheckbox } from '../../../../components/hook-form';

// import useLocales from '../../../../hooks/useLocales';

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

const WaitSignalMode = ({ methods, isEdit, setValue, watch }) => {
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
    setValue('wait_signal_methods_id', current.methodsId);
  };

  const values = watch();

  useEffect(() => {
    if (isEdit) {
      if (values.wait_signal_methods_id && values.wait_signal_methods_id.length > 0) {
        const current = { methodsName: [] };

        values.wait_signal_methods_id.forEach((_id) => {
          const find = methods.find((a) => a._id === _id);
          if (find) {
            current.methodsName.push(find.name);
          }
        });

        setMethodsName(current.methodsName);
        setMethodsId(values.wait_signal_methods_id);
        setValue('wait_signal_methods_id', values.wait_signal_methods_id);
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
      <Grid item xs={12} md={12}>
        <RHFCheckbox name="wait_signal_auto_sort_enabled" label={translate('shuffle_method_order')} />
      </Grid>
      <Grid item xs={12} md={12}>
        <RHFCheckbox name="wait_signal_no_repeat_method_enabled" label={translate('dont_repeat_method_next_turn')} />
      </Grid>
      <Grid item xs={12} md={12}>
        <TabsSignal />
      </Grid>
      {/* <Grid item xs={6} md={6}>
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
          type={'number'}
          label={translate('change_when_profit')}
          size="small"
        />
      </Grid>
      <Grid item xs={6} md={6}>
        <RHFTextField name="autochange_stop_loss" type={'number'} label={translate('change_when_loss')} size="small" />
      </Grid> */}
    </Grid>
  );
};

const WinSignal = () => {
  const { translate } = useLocales();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <RHFCheckbox name="wait_signal_win_enabled" label={translate('active_win_signal')} />
      </Grid>
      <Grid item xs={12} md={6}>
        <RHFCheckbox name="wait_signal_win_reverse_order_enabled" label={translate('reverse_order')} />
      </Grid>
      <Grid item xs={12} md={12}>
        <RHFCheckbox
          name="wait_signal_win_bet_at_end_streak"
          label={translate('enter_at_the_end_of_the_winning_streak')}
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <RHFCheckbox name="wait_signal_win_exact_numbers_wins" label={translate('order_when_exactly_winning_streak')} />
      </Grid>
      <Grid item xs={12} md={6}>
        <RHFTextField
          size="small"
          name="wait_signal_win_bet_at_win_streak"
          type="number"
          label={translate('order_when_winning_streak_reached')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <RHFTextField
          size="small"
          name="wait_signal_win_bet_count"
          type="number"
          label={translate('win_number_of_entries')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <RHFTextField
          size="small"
          name="wait_signal_win_change_method_when_lose_streak"
          type="number"
          label={translate('change_method_when_losing_streak')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <RHFTextField
          size="small"
          name="wait_signal_win_change_method_when_win_streak"
          type="number"
          label={translate('change_method_when_winning_streak')}
        />
      </Grid>
    </Grid>
  );
};

const LoseSignal = () => {
  const { translate } = useLocales();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <RHFCheckbox name="wait_signal_lose_enabled" label={translate('active_lose_signal')} />
      </Grid>
      <Grid item xs={12} md={6}>
        <RHFCheckbox name="wait_signal_lose_reverse_order_enabled" label={translate('reverse_order')} />
      </Grid>
      <Grid item xs={12} md={12}>
        <RHFCheckbox
          name="wait_signal_lose_bet_at_end_streak"
          label={translate('enter_at_the_end_of_the_losing_streak')}
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <RHFCheckbox
          name="wait_signal_lose_exact_numbers_loses"
          label={translate('order_when_exactly_losing_streak')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <RHFTextField
          size="small"
          name="wait_signal_lose_bet_at_lose_streak"
          type="number"
          label={translate('order_when_losing_streak_reached')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <RHFTextField
          size="small"
          name="wait_signal_lose_bet_count"
          type="number"
          label={translate('win_number_of_entries')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <RHFTextField
          size="small"
          name="wait_signal_lose_change_method_when_lose_streak"
          type="number"
          label={translate('change_method_when_losing_streak')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <RHFTextField
          size="small"
          name="wait_signal_lose_change_method_when_win_streak"
          type="number"
          label={translate('change_method_when_winning_streak')}
        />
      </Grid>
    </Grid>
  );
};

const VictorSignal = () => {
  const { translate } = useLocales();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <RHFCheckbox name="wait_signal_victor_enabled" label={translate('active_victor_signal')} />
      </Grid>
      <Grid item xs={12} md={6}>
        <RHFCheckbox name="wait_signal_lose_reverse_order_enabled" label={translate('reverse_order')} />
      </Grid>
      <Grid item xs={12} md={12}>
        <RHFCheckbox
          name="wait_signal_victor_bet_at_end_streak"
          label={translate('enter_at_the_end_of_the_losing_streak')}
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <RHFCheckbox
          name="wait_signal_victor_exact_numbers_victors"
          label={translate('order_when_exactly_victor_streak')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <RHFTextField
          size="small"
          name="wait_signal_victor_bet_at_victor_streak"
          type="number"
          label={translate('order_when_victor_streak_reached')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <RHFTextField
          size="small"
          name="wait_signal_victor_bet_count"
          type="number"
          label={translate('victor_number_of_entries')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <RHFTextField
          size="small"
          name="wait_signal_victor_change_method_when_lose_streak"
          type="number"
          label={translate('change_method_when_losing_streak')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <RHFTextField
          size="small"
          name="wait_signal_victor_change_method_when_win_streak"
          type="number"
          label={translate('change_method_when_winning_streak')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <RHFTextField
          size="small"
          name="wait_signal_victor_change_method_when_victor_streak"
          type="number"
          label={translate('change_method_when_victor_streak')}
        />
      </Grid>
    </Grid>
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const TabsSignal = () => {
  const { currentTab, onChangeTab } = useTabs('Win.S');

  const ACCOUNT_TABS = [
    {
      value: 'Win.S',
      component: <WinSignal />,
    },
    {
      value: 'Lose.S',
      component: <LoseSignal />,
    },
    {
      value: 'Victor.S',
      component: <VictorSignal />,
    },
  ];

  return (
    <>
      <Tabs
        allowScrollButtonsMobile
        variant="fullWidth"
        scrollButtons="auto"
        value={currentTab}
        onChange={onChangeTab}
        centered
      >
        {ACCOUNT_TABS.map((tab) => {
          return <Tab disableRipple key={tab.value} label={tab.value} value={tab.value} />;
        })}
      </Tabs>
      <Divider />
      <Box sx={{ mb: 3 }} />

      {ACCOUNT_TABS.map((tab) => {
        const isMatched = tab.value === currentTab;

        return isMatched && <Box key={tab.value}>{tab.component}</Box>;
      })}
    </>
  );
};

export default WaitSignalMode;
