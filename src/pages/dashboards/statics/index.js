// @mui
import { Container, Grid } from '@mui/material';
import Page from 'src/component/Page';
import useLocales from 'src/hooks2/useLocales';
import useSettings from 'src/hooks2/useSettings';
import { StaticsLinkAccountTimeline } from 'src/sections/@dashboard/general/home';

// components

// ----------------------------------------------------------------------

export default function StaticsTimeLine() {
  const { themeStretch } = useSettings();
  const { translate } = useLocales();

  return (
    <Page title={translate('statics')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <StaticsLinkAccountTimeline />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
