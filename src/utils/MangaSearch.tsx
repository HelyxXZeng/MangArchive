import axios from "axios";

const searchManga = async (
  title: string,
  limit: number = 20,
  offset: number = 0,
  authorOrArtist: string = "",
  authors: string[] = [],
  artists: string[] = [],
  year: number = 0,
  availableTranslatedLanguage: string[] = [],
  originalLanguage: string[] = [],
  publicationDemographic: string[] = [],
  ids: string[] = [],
  contentRating: string[] = ["safe", "suggestive", "erotica", "pornographic"],
  excludedTagNames: string[] = [],
  excludedTagsMode: string = "OR",
  includedTagNames: string[] = [],
  includedTagsMode: string = "AND",
  status: string = "",
  order: any = {},
  filters: any[] = [],
  createdAtSince: string = "",
  updatedAtSince: string = ""
) => {
  const baseUrl = "https://mangapi.alse.workers.dev/api/";

  try {
    const params: any = {
      title: title,
      limit: limit,
      offset: offset,
    };

    if (authorOrArtist) params.authorOrArtist = authorOrArtist;
    if (authors.length > 0) params.authors = authors;
    if (artists.length > 0) params.artists = artists;
    if (year > 0) params.year = year;
    if (availableTranslatedLanguage.length > 0)
      params.availableTranslatedLanguage = availableTranslatedLanguage;
    if (originalLanguage.length > 0) params.originalLanguage = originalLanguage;
    if (publicationDemographic.length > 0)
      params.publicationDemographic = publicationDemographic;
    if (ids.length > 0) params.ids = ids;
    if (contentRating.length > 0) params.contentRating = contentRating;
    if (excludedTagNames.length > 0) params.excludedTags = excludedTagNames;
    if (excludedTagsMode) params.excludedTagsMode = excludedTagsMode;
    if (includedTagNames.length > 0) params.includedTags = includedTagNames;
    if (includedTagsMode) params.includedTagsMode = includedTagsMode;
    if (status) params.status = status;
    if (Object.keys(order).length > 0) params.order = order;
    if (filters.length > 0) params.filters = filters;
    if (createdAtSince) params.createdAtSince = createdAtSince;
    if (updatedAtSince) params.updatedAtSince = updatedAtSince;

    const resp = await axios.get(
      `${baseUrl}/manga?includes[]=cover_art&includes[]=author&includes[]=artist`,
      { params }
    );
    return resp.data;
  } catch (error) {
    console.error("Error searching manga:", error);
    return [];
  }
};

export default searchManga;
