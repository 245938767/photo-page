import React from 'react';

import { Container } from '../../components/ui/Container';
import { Headline } from './Headline';

export default function HomePage() {
  const baseKey = 'PHOTO_QUERY_KEY';

  return (
    <>
      <Container className="mt-10">
        <Headline />
      </Container>
      <Container className="mt-24 md:mt-28">
        图片内容
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </Container>
    </>
  );
}

export const revalidate = 60;
