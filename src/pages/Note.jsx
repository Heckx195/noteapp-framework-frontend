import React, { lazy, Suspense } from 'react';

const TextContent = lazy(() => import('../components/TextContent'));
const ImageContent = lazy(() => import('../components/ImageContent'));

const renderLoader = () => <p>Loading</p>;

function Note() {
  return (
    <Suspense fallback={renderLoader()}>
      <TextContent text="Hello that is the content of a note." />
      <ImageContent />
    </Suspense>
  );
}

export default Note;
