import { proxy } from 'valtio';

export type photoFilter = {
  slug: string;
  page: number;
  pageSize: number;
};

export const state = proxy<photoFilter>({
  slug: '',
  page: 0,
  pageSize: 100,
});
function useFilter() {
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

  return { state, next, reset, resetFilter };
}

export default useFilter;
