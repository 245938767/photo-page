'use client';

import React, { useEffect, useState } from 'react';
import { getPhotos } from '@/api/photoApi';
import { Photo } from '@prisma/client';
import { proxy, useSnapshot } from 'valtio';

import { Container } from '../../components/ui/Container';
import { Headline } from './Headline';
import { Photos } from './Photos';
import { state } from './useFilter';
import { usePhotoQuery } from './usePhoto';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

const totals = proxy({
  slug: true,
});
export default function HomePage() {
  const filter = useSnapshot(state);
  const [dataList, setDataList] = useState<Photo[]>([]);
  const { data,isLoading} = usePhotoQuery(filter);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { slug } = useSnapshot(totals);
  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingMore) {
        return;
      }

      if (filter.page * filter.pageSize > dataList.length) {
        return;
      }

      if (
        document.documentElement.scrollHeight - document.documentElement.offsetHeight-50  <=
        document.documentElement.scrollTop
      ) {
        loadMore();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLoadingMore, dataList.length]);
  const loadMore = async () => {
    setIsLoadingMore(true);
    state.page = state.page + 1;
  };

  useEffect(() => {
    if (isLoadingMore && !slug) {
      getPhotos(filter.slug, filter.page, filter.pageSize).then((result)=>{
        result && setDataList((prevItems=>[...prevItems, ...result]));
      }).finally(()=>{
      setIsLoadingMore(false);
      });
    } else if (slug) {
    setIsLoadingMore(true);
       getPhotos(filter.slug, filter.page, filter.pageSize).then((result)=>{
        result && setDataList(result);
       }).finally(()=>{
    setIsLoadingMore(false);
      totals.slug = false;
       })
    }
  }, [data, isLoadingMore, slug]);

  useEffect(() => {
    totals.slug = true;
    state.page = 0;
  }, [filter.slug]);

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
        {isLoadingMore && <div className="mt-2 text-center">加载中...</div>}
        {filter.page * filter.pageSize > dataList.length && !isLoadingMore && (
          <div className="mt-2 text-center">没有更多了</div>
        )}
      </Container>
    </>
  );
}

export const revalidate = 60;
