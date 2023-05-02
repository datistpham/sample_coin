import { createContext } from 'react';
import io from 'socket.io-client';
import { HOST_API } from '../config';

export const socket = {
  current: null,
  interval: null,
  roomsIn: [],
};

export const SocketContext = createContext();

export const connect = () => {
  try {
    socket.current = io.connect(HOST_API, {
      auth: {
        token: localStorage.getItem('accessToken'),
      },
    });
  } catch (e) {
    console.log(e);
  }
};

export const emit = (type, data) => {
  try {
    if (socket.current) {
      if (type === 'trade-room') {
        if (data === 'join') socket.roomsIn.push(type);

        if (data === 'leave') {
          const index = socket.roomsIn.indexOf(type);
          if (index > -1) {
            socket.roomsIn.splice(index, 1);
          }
        }
      }
      socket.current.emit(type, data);
    }
  } catch (e) {
    console.log(e);
  }
};
