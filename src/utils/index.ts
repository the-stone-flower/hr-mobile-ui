import { debounce, DebouncedFunc } from 'lodash';

interface MatchItem {
  label: string;
  value: string | string[] | null;
}

export function flattenMatchMap(match_map: MatchItem[]): string[] {
  return match_map
    .filter((item): item is MatchItem & { value: string | string[] } => item.value !== null)
    .flatMap((item) => (Array.isArray(item.value) ? item.value : [item.value]));
}

//
export function debounceSearch<T extends (...args: any[]) => any>(func: T, wait: number = 500): DebouncedFunc<T> {
  return debounce(func, wait);
}
