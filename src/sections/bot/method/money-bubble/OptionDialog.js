import { useSnackbar } from 'notistack';

import { useState, useEffect } from 'react';
import {
  Grid,
  CircularProgress,
  Stack,
  IconButton,
  TextField,
  MenuItem,
  Button,
  Card,
  CardHeader,
  CardContent,
  Paper,
} from '@mui/material';
import Draggable from 'react-draggable';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Iconify from 'src/component/Iconify';
import useLocales from 'src/hooks2/useLocales';


// import Iconify from '../../../../components/Iconify';
// import useLocales from '../../../../hooks/useLocales';
// import { API_WALLET } from '../../../../apis';

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

export default function OptionDialog({
  isOpen,
  setIsOpen,
  number,
  isEdit = false,
  indexEdit = 0,
  data = {},
  submitAddCondition,
  submitEditCondition,
  submitDeleteCondition,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();

  const [loading, setLoading] = useState(true);

  const [maxWidth, setMaxWidth] = useState('sm');

  const [betType, setBetType] = useState(1);

  const [conditions, setConditions] = useState([]);

  const addCondition = () => {
    setConditions([{ board: 4, bubble: 1, result_type: 1, time: new Date().getTime() }, ...conditions]);
  };

  const deleteCondition = (time) => {
    setConditions(conditions.filter((a) => a.time !== time));

    // console.log(newArr2);
  };

  const setPropertyCondition = (key, value, property) => {
    const newData = [...conditions];
    newData[key][property] = value;

    setConditions(newData);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isEdit) {
      setConditions([]);
      setBetType(1);

      return;
    }

    setBetType(data.betType);
    setConditions(data.conditions);
  }, [isOpen, isEdit]);

  const confirm = () => {
    const data = { bubble: number, betType, conditions };
    if (!isEdit) {
      submitAddCondition(data);

      return;
    }
    submitEditCondition(indexEdit, data);
  };

  const handleDelete = () => {
    submitDeleteCondition(data.time);
    handleClose();
  };

  return (
    <>
      <Dialog
        open={isOpen}
        PaperComponent={PaperComponent}
        onClose={handleClose}
        maxWidth={maxWidth}
        fullWidth
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          {translate('enter_conditions_and_signals_for_the_bubble')} : {number}
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={12}>
              <Card>
                <CardHeader title={translate('signals_added')} />
                <CardContent>
                  <Grid container spacing={2}>
                    {conditions.map((condition, key) => (
                      <Grid item xs={12} md={12} key={key}>
                        <Grid container spacing={1}>
                          <Grid item xs={3} md={3}>
                            <TextField
                              select
                              label={translate('board')}
                              fullWidth
                              size="small"
                              value={conditions[key].board}
                              onChange={(e) => {
                                setPropertyCondition(key, e.target.value, 'board');
                              }}
                            >
                              {[1, 2, 3, 4, 5].map((number) => (
                                <MenuItem key={number} value={number}>
                                  {number}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>
                          <Grid item xs={4} md={4}>
                            <TextField
                              select
                              label={translate('bubble')}
                              fullWidth
                              size="small"
                              value={conditions[key].bubble}
                              onChange={(e) => {
                                setPropertyCondition(key, e.target.value, 'bubble');
                              }}
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((number) => (
                                <MenuItem key={number} value={number}>
                                  {number}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>
                          <Grid item xs={4} md={4}>
                            <TextField
                              select
                              label={translate('result_type')}
                              fullWidth
                              size="small"
                              value={conditions[key].result_type}
                              onChange={(e) => {
                                setPropertyCondition(key, e.target.value, 'result_type');
                              }}
                            >
                              <MenuItem key={0} value={0}>
                                <Iconify sx={{ color: 'error.main' }} icon={'akar-icons:circle-fill'} />
                              </MenuItem>
                              <MenuItem key={1} value={1}>
                                <Iconify sx={{ color: 'success.main' }} icon={'akar-icons:circle-fill'} />
                              </MenuItem>
                              <MenuItem key={2} value={2}>
                                <Iconify sx={{ color: 'gray' }} icon={'akar-icons:circle-fill'} />
                              </MenuItem>
                            </TextField>
                          </Grid>

                          <Grid item xs={1} md={1}>
                            <Stack height="100%" alignItems="center" justifyContent="center">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  deleteCondition(conditions[key].time);
                                }}
                              >
                                <Iconify sx={{ color: 'error.main' }} icon={'el:remove-sign'} />
                              </IconButton>
                            </Stack>
                          </Grid>
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={12}>
              <Button
                startIcon={<Iconify icon={'fa-solid:signal'} />}
                fullWidth
                variant="contained"
                color="success"
                onClick={addCondition}
              >
                {translate('add_signal')}
              </Button>
            </Grid>

            <Grid item xs={12} md={12}>
              <TextField
                select
                label={translate('bet_type')}
                fullWidth
                size="small"
                value={betType}
                onChange={(e) => setBetType(e.target.value)}
              >
                <MenuItem key={0} value={0}>
                  {translate('down')}
                </MenuItem>
                <MenuItem key={1} value={1}>
                  {translate('up')}
                </MenuItem>
                <MenuItem key={3} value={3}>
                  {translate('skip')}
                </MenuItem>
              </TextField>
            </Grid>

            {!isEdit ? (
              <Grid item xs={12} md={12}>
                <Button
                  startIcon={<Iconify icon={isEdit ? 'bxs:edit-location' : 'game-icons:confirmed'} />}
                  fullWidth
                  variant="contained"
                  color={isEdit ? 'warning' : 'primary'}
                  onClick={confirm}
                >
                  {translate(!isEdit ? 'confirm' : 'edit')}
                </Button>
              </Grid>
            ) : (
              <>
                <Grid item xs={6} md={6}>
                  <Button
                    startIcon={<Iconify icon={'fluent:delete-48-filled'} />}
                    fullWidth
                    variant="contained"
                    color={'error'}
                    onClick={handleDelete}
                  >
                    {translate('delete')}
                  </Button>
                </Grid>
                <Grid item xs={6} md={6}>
                  <Button
                    startIcon={<Iconify icon={isEdit ? 'bxs:edit-location' : 'game-icons:confirmed'} />}
                    fullWidth
                    variant="contained"
                    color={isEdit ? 'warning' : 'primary'}
                    onClick={confirm}
                  >
                    {translate(!isEdit ? 'confirm' : 'edit')}
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}
