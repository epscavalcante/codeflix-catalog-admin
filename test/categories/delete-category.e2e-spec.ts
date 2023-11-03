import Category from '@core/domain/entities/category.entity';
import ICategoryRepository from '@core/domain/repositories/category.repository.interface';
import { CATEGORY_PROVIDERS } from '../../src/categories/categories.provider';
import { startApp } from '../helpers/start-app';
import request from 'supertest';

describe('CategoriesController (e2e)', () => {
    describe('DELETE /delete/:id', () => {
        const appHelper = startApp();
        describe('should a response error when id is invalid or not found', () => {
            const arrange = [
                {
                    id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
                    expected: {
                        statusCode: 404,
                        error: 'Not Found',
                        message:
                            'Category not found using ID: 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
                    },
                },
                {
                    id: 'fake id',
                    expected: {
                        statusCode: 422,
                        error: 'Unprocessable Entity',
                        message: 'Validation failed (uuid is expected)',
                    },
                },
            ];

            test.each(arrange)('when id is $id', async ({ id, expected }) => {
                return request(appHelper.app.getHttpServer())
                    .delete(`/categories/${id}`)
                    .expect(expected.statusCode)
                    .expect(expected);
            });
        });

        it('should delete a category response with status 204', async () => {
            const categoryRepo = appHelper.app.get<ICategoryRepository>(
                CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
            );
            const category = Category.fake().aCategory().build();
            await categoryRepo.insert(category);

            await request(appHelper.app.getHttpServer())
                .delete(`/categories/${category.categoryId.value}`)
                .expect(204);

            await expect(
                categoryRepo.findById(category.categoryId),
            ).resolves.toBeNull();
        });
    });
});
