import { Stack, Grid, Card, CardContent } from '@mui/material';

import { React, useRef, useEffect, useState, useContext, useCallback } from 'react';
import { SocketContext } from 'src/contexts/socketWeb';

function CanvasResults() {
  const [data, setData] = useState([]);
  const socket = useContext(SocketContext);

  const setDataCanvas = (data) => {
    try {
      setData(data);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    try {
      socket.current.on('LAST_RESULTS', setDataCanvas);
      socket.current.emit('LAST_RESULTS', null);
    } catch (e) {
      console.log(e);
    }

    return () => {
      try {
        socket.current.off('LAST_RESULTS', setDataCanvas);
      } catch (e) {
        console.log(e);
      }
    };
  }, [socket]);

  return (
    <Card>
      <CardContent>
        <Grid container alignItems="center" justifyContent="center">
          <Stack direction="row" spacing={3} alignItems="center" justifyContent="center" textAlign="center">
            <Grid item xs={2} md={2}>
              <Canvas prices={data} cv={0} />
            </Grid>
            <Grid item xs={2} md={2}>
              <Canvas prices={data} cv={1} />
            </Grid>
            <Grid item xs={2} md={2}>
              <Canvas prices={data} cv={2} />
            </Grid>{' '}
            <Grid item xs={2} md={2}>
              <Canvas prices={data} cv={3} />
            </Grid>{' '}
            <Grid item xs={2} md={2}>
              <Canvas prices={data} cv={4} />
            </Grid>
          </Stack>
        </Grid>
      </CardContent>
    </Card>
  );
}

const Canvas = (props) => {
  const canvasRef = useRef(null);
  const cv = props.cv;
  const prices = props.prices;
  useEffect(() => {
    if (!prices && prices && prices.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const data = { i: 0, a: 0, currentX: 0, currentY: 0, ratio: 1 };
    if (cv === 0) data.a = -1;
    else if (cv === 1) data.a = 19;
    else if (cv === 2) data.a = 39;
    else if (cv === 3) data.a = 59;
    else if (cv === 4) data.a = 79;
    while (data.i < 20) {
      if (data.i % 20 === 0 && data.i !== 0) {
        data.currentX += 50 / data.ratio;
        data.currentY = 25 / data.ratio;
      } else if (data.i % 4 === 0) {
        data.currentX += 25 / data.ratio;
        data.currentY = 25 / data.ratio;
      } else {
        data.currentY += 25 / data.ratio;
      }
      data.a += 1;

      ctx.beginPath();
      ctx.arc(data.currentX, data.currentY, 12 / data.ratio, 0, 2 * Math.PI);
      try {
        if (prices[data.a].type === 0) ctx.fillStyle = '#fc5f5f';
        if (prices[data.a].type === 1) ctx.fillStyle = '#31baa0';
        if (prices[data.a].type === 2) ctx.fillStyle = '#a2afb8';
        if (prices[data.a].type === 3) ctx.fillStyle = '#1c2942';
        ctx.fill();
      } catch (e) {
        console.log(e);
      }
      data.i += 1;
    }
  }, [prices]);

  const dataSize = { widthRatio: 1000 / 7, ratio: 0, height: 0, width: 0, originWidth: 170, originalHeight: 145 };

  dataSize.ratio = dataSize.originWidth / dataSize.widthRatio;
  dataSize.height = dataSize.originalHeight / dataSize.ratio;
  dataSize.width = dataSize.widthRatio;

  return <canvas ref={canvasRef} width={dataSize.width} height={dataSize.height} style={{ width: '100%' }} />;
};

export default CanvasResults;
