'use client';

import React, { useEffect, useState } from 'react';
import { Photo } from '@prisma/client';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useSnapshot } from 'valtio';

import { Container } from '../../components/ui/Container';
import { Headline } from './Headline';
import { Photos } from './Photos';
import { state } from './useFilter';
import { usePhotoQuery } from './usePhoto';

export default function HomePage() {
  const filter = useSnapshot(state);
  const [dataList, setDataList] = useState<Photo[]>([]);
  const { data, isLoading } = usePhotoQuery(filter);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY + window.innerHeight >= document.body.scrollHeight) {
        state.page = state.page + 1;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  useEffect(() => {
    data && setDataList([...dataList, ...data]);
  }, [data]);

  return (
    <>
      <Container className="mt-10">
        <Headline />
      </Container>
      <Container className="mt-24 md:mt-28">
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1100: 4, 1500: 5 }}
        >
          <Masonry>
            {dataList?.map((image, index) => {
              return <Photos key={index} {...image} />;
            })}
          </Masonry>
        </ResponsiveMasonry>
        {isLoading && '正在加载'}
      </Container>
    </>
  );
}

export const revalidate = 60;
