'use client';

import { proxy, useSnapshot } from 'valtio';

export type photoFilter = {
  slug: string;
  page: number;
  pageSize: number;
};
function useFilter() {
  const state = proxy<photoFilter>({
    slug: '',
    page: 0,
    pageSize: 100,
  });
  const filter = useSnapshot(state);
  const next = () => {
    state.page = state.page + 1;
  };
  const reset = () => {
    state.page = 0;
    state.pageSize = 100;
  };
  const resetFilter = () => {
    state.slug = '';
  };

  return { filter, state, next, reset, resetFilter };
}

export default useFilter;
