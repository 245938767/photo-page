// import { useMemo } from 'react';
// import { getPhotos } from '@/api/photoApi';
// import { useQuery, useQueryClient } from '@tanstack/react-query';

// import useFilter, { photoFilter } from './useFilter';

// const fetchPhoto = async ({ queryKey: [, params] }) => {
//   const response = await getPhotos({
//     ...params,
//     page: params?.page ?? 0,
//     pagesize: params?.pageSize,
//   });
//   return response;
// };

// const baseKey = 'PHOTO_QUERY_KEY';
// export const PhotoKeys = {
//   base: [baseKey],
//   filter(params: photoFilter) {
//     return [...PhotoKeys.base, params];
//   },
// };

// function useRefetchPhoto() {
//   const queryClient = useQueryClient();
//   return () => queryClient.invalidateQueries({ queryKey: PhotoKeys.base });
// }

// function usePhotoQuery() {
//   const { filter } = useFilter();

//   const query = useQuery({
//     queryKey: [baseKey, filter],
//     queryFn: fetchPhoto,
//     refetchOnWindowFocus: false,
//   });

//   const pagination = useMemo(
//     () => ({
//       page: filter.page ?? 0,
//       pageSize: filter.pageSize ?? 0,
//     }),
//     [filter.page, filter.pageSize]
//   );

//   return {
//     pagination,
//     ...query,
//   };
// }

// function usePhoto() {
//   const { data, ...rest } = usePhotoQuery();
//   return {
//     opelogList: data,
//     ...rest,
//   };
// }

// function usePhotoTotalPage() {
//   const { data } = usePhotoQuery();
//   return data;
// }

// export { useRefetchPhoto, usePhoto, usePhotoQuery, usePhotoTotalPage };
