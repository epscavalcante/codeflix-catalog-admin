import Category, { CategoryId } from '@core/category/domain/category.aggregate';
import CategoryModel from '@core/category/infra/database/sequelize/models/category.model';
import EntityValidationError from '@core/shared/domain/errors/entity-validation.error';

export default class CategoryMapper {
    static toModel(category: Category): CategoryModel {
        return CategoryModel.build({
            categoryId: category.categoryId.value,
            name: category.name,
            description: category.description,
            isActive: category.isActive,
            createdAt: category.createdAt,
        });
    }

    static toEntity(model: CategoryModel): Category {
        const category = new Category({
            categoryId: new CategoryId(model.categoryId),
            name: model.name,
            description: model.description!,
            isActive: model.isActive,
            createdAt: model.createdAt,
        });

        category.validate();

        if (category.notification.hasErrors()) {
            throw new EntityValidationError(category.notification.toJSON());
        }

        return category;
    }
}
