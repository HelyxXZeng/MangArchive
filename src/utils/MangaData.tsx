import { uniq } from 'lodash';
// import { parse } from 'date-fns';

// import corsAxios from '../utils/corsAxios';
import axios from 'axios';


const getDataApi = async (slug: any) => {
    const returnData: any = { slug, staff: [] }

    // const { data: { data: titleData } } = await corsAxios({
    //     url: `https://api.mangadex.org/manga/${slug}?includes[]=cover_art&includes[]=author&includes[]=artist`
    // })

    const { data: { data: titleData } } = await axios({
        method: 'GET',
        url: `https://api.mangadex.org/manga/${slug}?includes[]=cover_art&includes[]=author&includes[]=artist`,
        // params: {
        //   limit: 10,
        //   offset: 0
        // }
    });

    returnData.title = Object.values(titleData.attributes.title)[0] || "No title";
    returnData.series_name = returnData.title;
    returnData.description = Object.values(titleData.attributes.description)[0] || "No description";
    const coverArt = titleData.relationships.find((r: any) => r.type === "cover_art")?.attributes.fileName;
    returnData.cover = `https://uploads.mangadex.org/covers/${slug}/${coverArt}`;

    const { data: { data: chaptersData } } = await axios({
        method: 'GET',
        url: `https://api.mangadex.org/manga/${slug}/feed?order[chapter]=asc&limit=500`, /* translatedLanguage[]=vi& */
    });

    const chapterArray = chaptersData.map((chapter: any) => ({
        id: chapter.id,
        volume: chapter.attributes.volume,
        chapterNumber: chapter.attributes.chapter,
        title: chapter.attributes.title,
        translatedLanguage: chapter.attributes.translatedLanguage,
        groupId: chapter.relationships.find((r: any) => r.type === "scanlation_group")?.id || "99c579c7-935b-4bc5-a8e8-a46da371462b",
        release_date: chapter.attributes.createdAt,
        last_updated: chapter.attributes.updatedAt
    }));

    const groupIdArray: any = uniq(chapterArray.map((c: any) => c.groupId));
    const groupIdToNumber: any = {};
    const groups: any = {};
    groupIdArray.forEach((groupId: any, index: any) => { groupIdToNumber[groupId] = index; groups[index] = groupId });

    const chapters: any = {};
    chapterArray.forEach(({ id, volume, chapterNumber, title, translatedLanguage, groupId, release_date, last_updated }: any) => {
        const groupNumber = groupIdToNumber[groupId];
        if (!chapters[chapterNumber]) chapters[chapterNumber] = [];

        const thisChapter: any = {};
        thisChapter.volume = volume;
        thisChapter.last_updated = Date.parse(last_updated);
        thisChapter.title = title;
        thisChapter.translatedLanguage = translatedLanguage;

        thisChapter.groups = {};
        thisChapter.groups[groupNumber] = `/read/api/mangadex/chapter/${id}`;

        chapters[chapterNumber] = [...chapters[chapterNumber], thisChapter];
    })

    returnData.chapters = chapters;
    returnData.groups = groups;
    returnData.chapterNumbers = Object.keys(chapters);
    returnData.groupNumbers = Object.keys(groups);
    return returnData;
}

export { getDataApi };