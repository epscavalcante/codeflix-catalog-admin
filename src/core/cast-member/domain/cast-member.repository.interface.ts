import { Either } from '@core/shared/domain/either';
import { CastMemberId } from './cast-member-id.value-object';
import CastMemberType, {
    CastMemberTypeEnum,
} from './cast-member-type.value-object';
import CastMember from './cast-member.aggregate';
import ISearchableRepository, {
    SearchParams,
    SearchParamsConstructorProps,
    SearchResult,
} from '@core/shared/domain/repositories/searchable.repository.interface';
import { SearchValidationError } from '@core/shared/domain/errors/search-validation.error';

export type CastMemberFilter = {
    name?: string | null;
    type?: CastMemberType | null;
};

export class CastMemberSearchParams extends SearchParams<CastMemberFilter> {
    private constructor(
        props: SearchParamsConstructorProps<CastMemberFilter> = {},
    ) {
        super(props);
    }

    static create(
        props: Omit<
            SearchParamsConstructorProps<CastMemberFilter>,
            'filter'
        > & {
            filter?: {
                name?: string | null;
                type?: CastMemberTypeEnum | null;
            } | null;
        } = {},
    ) {
        const [type, errorCastMemberType] = Either.of(
            props.filter?.type ? Number(props.filter.type) : undefined,
        )
            .map((type) => type || undefined)
            .chain((type) =>
                type ? CastMemberType.create(type) : Either.of(undefined),
            );
        if (errorCastMemberType) {
            const error = new SearchValidationError([
                { type: [errorCastMemberType.message] },
            ]);

            throw error;
        }

        return new CastMemberSearchParams({
            ...props,
            filter: {
                name: props.filter?.name,
                type: type,
            },
        });
    }

    get filter(): CastMemberFilter | null {
        return this._filter || null;
    }

    protected set filter(value: CastMemberFilter | null) {
        const _value =
            !value || (value as unknown) === '' || typeof value !== 'object'
                ? null
                : value;

        const filter = {
            ...(_value?.name && { name: `${_value?.name}` }),
            ...(_value?.type && { type: _value.type }),
        };

        this._filter = Object.keys(filter).length === 0 ? null : filter;
    }
}

export class CastMemberSearchResult extends SearchResult<CastMember> {}

export default interface ICastMemberRepository
    extends ISearchableRepository<
        CastMember,
        CastMemberId,
        CastMemberFilter,
        CastMemberSearchParams,
        CastMemberSearchResult
    > {
    findByIds(castMemberIds: CastMemberId[]): Promise<CastMember[]>;
    existsByIds(castMembersId: CastMemberId[]): Promise<{
        exists: CastMemberId[];
        notExists: CastMemberId[];
    }>;
}
