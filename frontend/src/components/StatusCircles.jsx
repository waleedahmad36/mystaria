import React from 'react';
import { Box, Avatar, Tooltip } from '@chakra-ui/react';

const StatusCircles = ({ statuses }) => {
  const getBorderColor = (index) => {
    const colors = ['red.500', 'green.500', 'blue.500', 'purple.500', 'orange.500'];
    return colors[index % colors.length];
  };

  return (
    <Box display="flex" alignItems="center">
      {Object.keys(statuses).map((userId, index) => {
        const userStatuses = statuses[userId];
        const user = userStatuses[0].userId; // Assuming first status has user info

        return (
          <Tooltip key={userId} label={`${user.username}'s status`}>
            <Box
              borderWidth={3}
              borderColor={getBorderColor(index)}
              borderRadius="full"
              p={1}
              mx={2}
            >
              <Avatar src={user.profilePic} />
            </Box>
          </Tooltip>
        );
      })}
    </Box>
  );
};

export default StatusCircles;
