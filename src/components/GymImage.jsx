import React from 'react';
import withLogging from '../hoc/withLogging';

const GymImage = () => {
  return <img src="/gym.png" alt="Gym" />;
};

export default withLogging(GymImage);
