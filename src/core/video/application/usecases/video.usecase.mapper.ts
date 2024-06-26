import { CastMemberTypeEnum } from '@core/cast-member/domain/cast-member-type.value-object';
import CastMember from '@core/cast-member/domain/cast-member.aggregate';
import Category from '@core/category/domain/category.aggregate';
import Genre from '@core/genre/domain/genre.aggregate';
import { RatingClassifications } from '@core/video/domain/video-rating.vo';
import Video from '@core/video/domain/video.aggregate';

export type VideoCategoryOutputType = {
    id: string;
    name: string;
    isActive: boolean;
    // createdAt: Date;
};

export type VideoGenreOutputType = {
    id: string;
    name: string;
};

export type VideoCastMemberOutputType = {
    id: string;
    name: string;
    type: CastMemberTypeEnum;
};

export type VideoOutputType = {
    id: string;
    title: string;
    description: string;
    duration: number;
    banner: string | null;
    isPublished: boolean;
    isOpened: boolean;
    thumbnail: string | null;
    thumbnailHalf: string | null;
    video: string | null;
    trailer: string | null;
    yearLaunched: number;
    rating: RatingClassifications;
    genres: VideoGenreOutputType[];
    categories: VideoCategoryOutputType[];
    castMembers: VideoCastMemberOutputType[];
    createdAt: Date;
};

export default class VideoUseCaseMapper {
    static toOutput(
        video: Video,
        {
            categories,
            castMembers,
            genres,
        }: {
            categories: Category[];
            castMembers: CastMember[];
            genres: Genre[];
        },
    ): VideoOutputType {
        return {
            id: video.videoId.value,
            title: video.title,
            description: video.description,
            duration: video.duration,
            banner: video.banner?.url ?? null,
            thumbnail: video.thumbnail?.url ?? null,
            thumbnailHalf: video.thumbnailHalf?.url ?? null,
            video: video.video?.url ?? null,
            trailer: video.trailer?.url ?? null,
            yearLaunched: video.yearLaunched,
            rating: video.rating.value,
            isOpened: video.isOpened,
            isPublished: video.isPublished,
            categories: categories.map((category) => ({
                id: category.categoryId.value,
                name: category.name,
                isActive: category.isActive,
            })),
            castMembers: castMembers.map((castMember) => ({
                id: castMember.castMemberId.value,
                name: castMember.name,
                type: castMember.type.value,
            })),
            genres: genres.map((genre) => ({
                id: genre.genreId.value,
                name: genre.name,
            })),
            createdAt: video.createdAt,
        };
    }
}
