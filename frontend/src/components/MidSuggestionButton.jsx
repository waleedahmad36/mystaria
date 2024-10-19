import { Button } from '@chakra-ui/react'
import React from 'react'
import useFollowUnfollow from '../hooks/useFollowUnfollow';
import { useRecoilValue } from 'recoil';
import themeAtom from '../atoms/themeAtom';

const MidSuggestionButton = ({user}) => {
  const theme = useRecoilValue(themeAtom);
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);
  return (
    <Button size="sm" background={theme} variant="solid" mt={2} color={'white'}  isLoading={updating} 
    onClick={handleFollowUnfollow}  >
                {following ? 'following': 'follow'}
              </Button>
  )
}

export default MidSuggestionButton