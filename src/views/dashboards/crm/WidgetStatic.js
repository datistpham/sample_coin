import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography, Box, IconButton } from '@mui/material';
import Iconify from 'src/component/Iconify';
import { fShortenNumber } from 'src/utils/formatNumber';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 2, 2, 3),
  height: "100%"
}));

// ----------------------------------------------------------------------

WidgetStatic.propTypes = {
  color: PropTypes.oneOf(['primary', 'secondary', 'info', 'success', 'warning', 'error']),
  icon: PropTypes.any,
  title: PropTypes.string,
};

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(16),
  height: theme.spacing(16),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
}));

export default function WidgetStatic({ title, total, icon, isMoney = true, color = 'success', actions = null }) {
  return (
    <RootStyle>
      <div>
        <Typography variant="h3">
          {isMoney ? fShortenNumber(total) : total} {isMoney && '$'}
        </Typography>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {title}
          {actions && actions}
        </Typography>
      </div>
      <Box>
        <IconWrapperStyle
          sx={{
            color: (theme) => theme.palette[color].dark,
            bgcolor: 'white',
            backgroundImage: (theme) =>
              `linear-gradient(135deg, ${alpha(theme.palette[color].dark, 0)} 0%, ${alpha(
                theme.palette[color].dark,
                0.24
              )} 100%)`,

          }}
        >
          <Iconify icon={icon} width={35} height={35} />
        </IconWrapperStyle>
      </Box>
    </RootStyle>
  );
}
