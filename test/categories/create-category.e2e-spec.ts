import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CreateCategoryFixture } from '../../src/categories/categories.fixture';
import ICategoryRepository from '@core/domain/repositories/category.repository';
import { CATEGORY_PROVIDERS } from '../../src/categories/categories.provider';
import { startApp } from '../helpers/start-app';
import Uuid from '@core/domain/value-objects/uuid.vo';
import CategoryOutput from '@core/application/use-cases/mappers/category-output';
import { instanceToPlain } from 'class-transformer';
import { CategoryPresenter } from '../../src/categories/categories.presenter';

describe('CategoriesController (e2e)', () => {
    const appHelper = startApp();

    let repository: ICategoryRepository;

    beforeEach(async () => {
        repository = appHelper.app.get<ICategoryRepository>(
            CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
        );
    });

    describe('POST /categories', () => {
        describe('Should create category', () => {
            const arrange = CreateCategoryFixture.arrangeForCreate();

            test.each(arrange)(
                'When body is $send_data',
                async ({ send_data, expected }) => {
                    const response = await request(
                        appHelper.app.getHttpServer(),
                    )
                        .post('/categories')
                        .send(send_data);

                    expect(response.status).toBe(201);

                    const categoryResponse = response.body;
                    const categoryCreated = await repository.findById(
                        new Uuid(categoryResponse.id),
                    );
                    const presenter = new CategoryPresenter(
                        CategoryOutput.toOutput(categoryCreated),
                    );
                    const categorySerialized = instanceToPlain(presenter);

                    expect(categoryResponse).toStrictEqual({
                        id: categorySerialized.id,
                        createdAt: categorySerialized.createdAt,
                        ...expected,
                    });
                },
            );
        });

        describe('Should receives 422 statusCode when send invalid data', () => {
            const invalidRequest =
                CreateCategoryFixture.arrangeInvalidRequest();
            const arrange = Object.keys(invalidRequest).map((key) => ({
                label: key,
                value: invalidRequest[key],
            }));

            test.each(arrange)('When body is $label', async ({ value }) => {
                return request(appHelper.app.getHttpServer())
                    .post('/categories')
                    .send(value.send_data)
                    .expect(422)
                    .expect(value.expected);
            });
        });

        describe('Should receives 422 statusCode when send throw EntityValidationError', () => {
            const invalidRequest =
                CreateCategoryFixture.arrangeForEntityValidationException();
            const arrange = Object.keys(invalidRequest).map((key) => ({
                label: key,
                value: invalidRequest[key],
            }));

            test.each(arrange)('When body is $label', async ({ value }) => {
                return request(appHelper.app.getHttpServer())
                    .post('/categories')
                    .send(value.send_data)
                    .expect(422)
                    .expect(value.expected);
            });
        });
    });
});