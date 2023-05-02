import {
  Stack,
  MenuItem,
  Card,
  Grid,
  CardContent,
  Button,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { useState, useEffect, useContext } from 'react';
import useLocales from 'src/hooks2/useLocales';
import { SocketContext } from 'src/contexts/socket';
import Iconify from 'src/component/Iconify';
import { API_TELEBOT } from 'src/apis';


const compareTime = (a, b) => {
  if (a.time > b.time) {
    return 1;
  }
  if (a.time < b.time) {
    return -1;
  }

  return 0;
};

function SignalBotTelegram(props) {
  const socket = useContext(SocketContext);

  const [bots, setBots] = useState([]);
  const { translate } = useLocales();

  const [currentBot, setCurrentBot] = useState('');

  const getBotsRunning = async () => {
    try {
      const response = await API_TELEBOT.getListRunning();
      if (response.data.ok) {
        setBots(response.data.d);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (e) => {
    if (currentBot !== '') socket.current.emit('messages-telebot', { type: 'leave', botid: currentBot });
    setCurrentBot(e.target.value);
  };

  useEffect(() => {
    if (currentBot !== '') {
      socket.current.emit('messages-telebot', { type: 'join', botid: currentBot });
    }
  }, [currentBot]);

  const handleClickChannel = (e) => {
    try {
      const find = bots.find((a) => a.id === currentBot);
      if (find && find.url !== '') {
        window.open(find.url, '_blank', 'noopener,noreferrer');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getURLChannel = () => {
    try {
      const find = bots.find((a) => a.id === currentBot);
      if (find && find.url !== '') {
        return find.url;
      }
    } catch (e) {
      return '';
    }
  };

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.current.on('update_message_telebot', (data) => {
      if (data.id === currentBot) {
        // console.log(data.messages);
        // setMessages(data.messages);

        setMessages(data.messages.sort(compareTime));
      }
    });
  }, [currentBot, socket]);

  useEffect(() => {
    getBotsRunning();
  }, []);

  return (
    <Card sx={props.sx}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={7} md={7}>
            <TextField
              select
              label={translate('bot_configuration_name')}
              fullWidth
              value={currentBot}
              onChange={handleChange}
            >
              {bots.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {translate(option.name)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={5} md={5}>
            <Button
              fullWidth
              sx={{ height: '100%' }}
              size="large"
              variant="outlined"
              disabled={bots.filter((a) => a.id === currentBot && a.url !== '').length === 0}
              onClick={handleClickChannel}
              startIcon={<Iconify icon={'logos:telegram'} />}
            >
              Channel
            </Button>
          </Grid>
          <Grid item xs={12} md={12} sx={{ maxHeight: 500, overflow: 'auto' }}>
            <List component="nav" aria-label="mailbox folders">
              {messages && messages.length > 0 ? (
                messages.map((message, index) => (
                  <div key={index}>
                    <ListItem button>
                      <ListItemText primary={<Message data={message} />} />
                    </ListItem>
                    <Divider />
                  </div>
                ))
              ) : (
                <>
                  {bots
                    .filter((a) => a.url !== '')
                    .map((bot, key) => (
                      <Typography key={key}>
                        {' '}
                        {bot.name} | {bot.url}{' '}
                      </Typography>
                    ))}
                </>
              )}
            </List>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

const Message = ({ data }) => {
  if (data.type === 'place_order') {
    return <PlaceOrder data={data} />;
  }
  if (data.type === 'waiting_result') {
    return <WaitingResult data={data} />;
  }
  if (data.type === 'histories') {
    return <Histories data={data} />;
  }
  if (data.type === 'last_price') {
    return <LastPrice data={data} />;
  }

  return <></>;
};

const Histories = ({ data }) => {
  const { translate } = useLocales();

  try {
    const time = data.time;

    return (
      <>
        <Stack direction="row" spacing={1}>
          <Typography> {`[${format(new Date(time), 'HH:mm:ss')}]`}</Typography>
          <Typography sx={{ fontWeight: 'bold' }}>
            {translate('summary')} {data.message.histories.length} {translate('last_trading_session')} :{' '}
          </Typography>
        </Stack>
        {data.message.histories.map((history, index) => (
          <Stack key={index} direction="row" spacing={1}>
            <Iconify icon={'emojione-v1:alarm-clock'} />
            <Typography> {`${format(new Date(history.time), 'HH:mm')}`}</Typography>
            <Typography>{translate('session')} </Typography>
            <Typography sx={{ fontWeight: 'bold' }}>{history.session} </Typography>
            <Iconify icon={history.result === 1 ? 'noto:green-circle' : 'fluent-emoji:red-circle'} />
            <Typography>{history.profit} </Typography>
          </Stack>
        ))}
      </>
    );
  } catch (e) {
    console.log(e);

    return <></>;
  }
};

const PlaceOrder = ({ data }) => {
  const { translate } = useLocales();

  try {
    const betType = data.message.betType === 'UP' ? translate('up') : translate('down');
    const color = data.message.betType === 'UP' ? 'success.main' : 'error.main';

    return (
      <Stack direction="row" spacing={1}>
        <Typography> {`[${format(new Date(data.time), 'HH:mm:ss')}]`}</Typography>
        <Iconify icon={'ant-design:notification-filled'} sx={{ color: 'warning.main' }} />
        <Typography>{translate('please_trade')} </Typography>
        <Typography sx={{ color, fontWeight: 'bold' }}>
          {data.message.betAmount}$ {betType}
        </Typography>
      </Stack>
    );
  } catch (e) {
    console.log(e);

    return <></>;
  }
};

const LastPrice = ({ data }) => {
  const { translate } = useLocales();
  try {
    const price = data.message.price;
    const time = price[0];
    const openPrice = price[1];
    const closePrice = data[4];

    const current = { text: translate('up'), icon: 'fluent-emoji:victory-hand', color: 'success.main' };

    if (openPrice > closePrice) {
      current.text = translate('down');
      current.icon = 'ci:off-close';
      current.color = 'error.main';
    }
    if (openPrice === closePrice) {
      current.text = translate('tiebreak');
      current.icon = 'mdi:car-brake-hold';
      current.color = 'info.main';
    }

    return (
      <Stack direction="row" spacing={1}>
        <Typography> {`[${format(new Date(time), 'HH:mm:ss')}]`}</Typography>
        <Iconify icon={'fluent-emoji:last-track-button'} />
        <Typography>
          {' '}
          {translate('turn_just_finished')} : {current.text}{' '}
        </Typography>
        <Iconify icon={current.icon} sx={{ color: current.color }} />
      </Stack>
    );
  } catch (e) {
    console.log(e);

    return <></>;
  }
};

const WaitingResult = ({ data }) => {
  const { translate } = useLocales();
  try {
    return (
      <Stack direction="row" spacing={1}>
        <Typography> {`[${format(new Date(data.time), 'HH:mm:ss')}]`}</Typography>
        <Iconify icon={'medical-icon:i-waiting-area'} sx={{ color: 'warning.main' }} />
        <Typography> {translate('waiting_result')} ...</Typography>
      </Stack>
    );
  } catch (e) {
    console.log(e);

    return <></>;
  }
};

export default SignalBotTelegram;
