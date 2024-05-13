import axios from 'axios';

const searchManga = async (
    title: string,
    limit: any = 100,
    offset: any = 0,
    authorOrArtist: any = '' /* uuid */,
    authors: any[] = [],
    artists: any[] = [],
    year: any = 0,
    availableTranslatedLanguage: any = [] /* 'en', 'vi', 'ja' */,
    originalLanguage: any = [],
    publicationDemographic: any[] = [],
    ids: any = [] /* max 100 ids */,
    contentRating: any = [],
    excludedTagNames: any = [],
    excludedTagsMode: string = 'AND',
    includedTagNames: any = [],
    includedTagsMode: string = 'AND',
    status: any,
    order: any = [],
    filters: any = [],
    createdAtSince: any = '',
    updatedAtSince: any = '',
) => {

    const baseUrl = 'https://api.mangadex.org';

    try {
        const resp = await axios.get(`${baseUrl}/manga`, {
            params: {
                title: title,
                limit: limit,
                offset: offset,
                authorOrArtist: authorOrArtist,
                authors: authors.length === 0 ? null : authors,
                artists: artists.length === 0 ? null : artists,
                year: year >= 0 ? year : null,
                availableTranslatedLanguage: availableTranslatedLanguage,
                originalLanguage: originalLanguage,
                publicationDemographic: publicationDemographic,
                ids: ids /* max 100 ids */,
                contentRating: contentRating,
                excludedTagNames: excludedTagNames,
                excludedTagsMode: excludedTagsMode,
                includedTagNames: includedTagNames,
                includedTagsMode: includedTagsMode,
                status: status,
                order: order,
                filters: filters = [],
                createdAtSince: createdAtSince,
                updatedAtSince: updatedAtSince,
            }
        });

        return resp.data.data.map((manga: any) => manga.id);

    } catch (error) {
        console.error("Error searching manga:", error);
        return [];
    }
};

export default searchManga;