import React, { lazy, Suspense } from 'react';

const GymImage = lazy(() => import('./GymImage'));
const renderLoader = () => <p>Image Loading...</p>;

const ImageContent = () => {
  return (
    <Suspense fallback={renderLoader()}>
      <GymImage />
    </Suspense>
  );
};

export default ImageContent;
