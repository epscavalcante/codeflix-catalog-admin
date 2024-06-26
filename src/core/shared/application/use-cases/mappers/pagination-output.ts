import { SearchResult } from '@core/shared/domain/repositories/searchable.repository.interface';

export type PaginationOutputType<Item = any> = {
    items: Item[];
    total: number;
    lastPage: number;
    perPage: number;
    currentPage: number;
};

export default class PaginationOutput {
    static toOutput<Item = any>(
        items: Item[],
        props: Omit<SearchResult, 'items'>,
    ): PaginationOutputType<Item> {
        return {
            items,
            total: props.total,
            currentPage: props.currentPage,
            lastPage: props.lastPage,
            perPage: props.perPage,
        };
    }
}
