import { useMemo } from 'react';
import { getPhotos } from '@/api/photoApi';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { photoFilter } from './useFilter';

const fetchPhoto = async (params: photoFilter) => {
  const response = await getPhotos(params.slug, params.page, params.pageSize);
  return response;
};

const baseKey = 'PHOTO_QUERY_KEY';
export const PhotoKeys = {
  base: [baseKey],
  filter(params: photoFilter) {
    return [...PhotoKeys.base, params];
  },
};

function useRefetchPhoto() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: PhotoKeys.base });
}

function usePhotoQuery(filter: photoFilter) {
  const query = useQuery({
    queryKey: [baseKey, filter],
    queryFn: (data) => fetchPhoto(filter),
    refetchOnWindowFocus: false,
  });

  const pagination = useMemo(
    () => ({
      page: filter.page ?? 0,
      pageSize: filter.pageSize ?? 0,
    }),
    [filter.page, filter.pageSize]
  );

  return {
    pagination,
    ...query,
  };
}

function usePhoto(filter: photoFilter) {
  const { data, ...rest } = usePhotoQuery(filter);
  return {
    opelogList: data,
    ...rest,
  };
}

function usePhotoTotalPage(filter: photoFilter) {
  const { data } = usePhotoQuery(filter);
  return data;
}

export { useRefetchPhoto, usePhoto, usePhotoQuery, usePhotoTotalPage };
