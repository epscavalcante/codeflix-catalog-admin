import Category from "../../domain/entities/category.entity";
import MemoryRespository from "./memory.repository";
import Uuid from "../../domain/value-objects/uuid.vo";
import { SearchableMemoryRepository } from "./searchable-memory.reposity";
import { SortDirection } from "domain/repositories/searchable.repository";

export default class CategoryMemoryRespository extends SearchableMemoryRepository<Category, Uuid> {
    sortableFields: string[] = ['name', 'createdAt'];

    async applyFilter(items: Category[], filter: string): Promise<Category[]> {
        if(!filter)
            return items;

        return items.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()))
    }
    
    protected applySorting(
        items: Category[], 
        sort: string, 
        sortDir: SortDirection
    ): Category[] {
        return sort 
            ? super.applySorting(items, sort, sortDir)
            : super.applySorting(items, 'createdAt', 'desc')
    }

    getEntity(): new (...args: any[]) => Category {
        return Category;
    }
}