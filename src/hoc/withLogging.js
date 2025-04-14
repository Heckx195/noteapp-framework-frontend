import React, { useEffect } from 'react';
import logger from '../tools/logger';

const withLogging = (WrappedComponent) => {
  if (typeof WrappedComponent !== 'function') {
    throw new Error('WrappedComponent must be a React component');
  }
  return (props) => {
    useEffect(() => {
      logger.log(`Mounted ${WrappedComponent.name}`);
      return () => {
        logger.log(`Unmounted ${WrappedComponent.name}`);
      };
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withLogging;
