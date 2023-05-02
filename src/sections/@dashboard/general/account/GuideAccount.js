import { Stack, Card, CardContent } from '@mui/material';

import { React } from 'react';
import GuideItem from './GuideItem';
import useLocales from 'src/hooks2/useLocales';
import TextIconLabel from 'src/component/TextIconLabel';
import Iconify from 'src/component/Iconify';


function GuideAccount() {
  const { translate } = useLocales();

  return (
    <>
      <Stack spacing={3}>
        <Card>
          <CardContent>
            <Stack spacing={3}>
              <TextIconLabel
                style={{
                  fontSize: '1em',
                }}
                icon={
                  <Iconify icon="clarity:success-standard-solid" color="green" sx={{ width: 25, height: 25, mr: 3 }} />
                }
                value={translate('you_can_add_multiple')}
                sx={{ typography: 'caption', color: 'orange' }}
              />
              <TextIconLabel
                style={{
                  fontSize: '1em',
                }}
                icon={<Iconify icon="simple-icons:askubuntu" color="green" sx={{ width: 25, height: 25, mr: 3 }} />}
                value={translate('if_not_activated_please_contact_upline')}
                sx={{ typography: 'caption', color: 'orange' }}
              />
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Stack spacing={3}>
              <GuideItem
                icon="el:key"
                title={`${translate('step')} 1`}
                content={translate('enter_your_email_and_pass')}
              />
              <GuideItem
                icon="bx:shield-quarter"
                title={`${translate('step')} 2`}
                content={translate('enter_2fa_code_and_email_confirm')}
              />
              <GuideItem
                icon="ic:baseline-cloud-done"
                title={`${translate('step')} 3`}
                content={translate('click_continue_to_complete')}
              />
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </>
  );
}

export default GuideAccount;
