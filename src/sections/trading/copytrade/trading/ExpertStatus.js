import { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';

import { Stack, Card, CardContent } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { getFollowersData } from 'src/redux/dashboard/account/action';
import useLocales from 'src/hooks2/useLocales';
import TextIconLabel from 'src/component/TextIconLabel';
import Iconify from 'src/component/Iconify';


function ExpertStatus() {
  const theme = useTheme();

  const dispatch = useDispatch();
  const { translate } = useLocales();

  const showFollowersData = async () => {
    dispatch(await getFollowersData());
  };
  useEffect(() => {
    showFollowersData();
  }, []);

  const followerData = useSelector((state) => state.followersData);

  return (
    <Stack spacing={2}>
      <Card>
        <CardContent>
          <TextIconLabel
            style={{
              fontSize: '0.9em',
              fontWeight: 'bold',
            }}
            icon={
              <Iconify
                icon="la:buromobelexperte"
                color={theme.palette.mode === 'light' ? 'black' : 'white'}
                sx={{ width: 25, height: 25, mr: 3 }}
              />
            }
            value={`${translate('total_profiles_are_following_you')} : ${
              followerData.followers && followerData.followers.length
            }`}
            sx={{ typography: 'caption', color: theme.palette.mode === 'light' ? 'black' : 'white' }}
          />
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <TextIconLabel
            style={{
              fontSize: '0.9em',
              fontWeight: 'bold',
            }}
            icon={
              <Iconify
                icon="carbon:gateway-user-access"
                color={theme.palette.mode === 'light' ? 'black' : 'white'}
                sx={{ width: 25, height: 25, mr: 3 }}
              />
            }
            value={`${translate('total_number_of_profiles_according_to_you_active')} : ${
              followerData.followersLoggedIn && followerData.followersLoggedIn.length
            }`}
            sx={{ typography: 'caption', color: theme.palette.mode === 'light' ? 'black' : 'white' }}
          />
        </CardContent>
      </Card>
    </Stack>
  );
}

export default ExpertStatus;
