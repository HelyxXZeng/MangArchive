import { uniq } from 'lodash';
// import { parse } from 'date-fns';
import axios from 'axios'; // Importing axios directly

interface Chapter {
    id: string;
    volume: string;
    chapterNumber: string;
    title: string;
    groupId: string;
    release_date: string;
    last_updated: string;
}

interface Group {
    [key: number]: string;
}

interface Chapters {
    [key: string]: {
        volume: string;
        title: string;
        groups: Group;
        last_updated: number;
    };
}

interface ReturnData {
    slug: string;
    staff: string[];
    source: string;
    title: string;
    series_name: string;
    description: string;
    cover: string;
    chapters: Chapters;
    groups?: Group;
    chapterNumbers: string[];
    groupNumbers: string[];
}

const getTitleApi = async (source: string = 'mangadex-vi', slug: string): Promise<ReturnData> => {
    if (source === 'mangadex-vi') {
        const returnData: ReturnData = { 
            slug, 
            staff: [], 
            source, 
            title: "", 
            series_name: "", 
            description: "", 
            cover: "", 
            chapters: {},
            chapterNumbers: [],
            groupNumbers: []
        };

        const { data: { data: titleData } } = await axios({
            url: `https://api.mangadex.org/manga/${slug}?includes[]=cover_art`
        });

        returnData.title = titleData.attributes.title.en || titleData.attributes.title.ja || "No title";
        returnData.series_name = returnData.title;
        returnData.description = titleData.attributes.description || "No description";
        const coverArt = titleData.relationships.find((r: any) => r.type === "cover_art")?.attributes.fileName;
        returnData.cover = `https://uploads.mangadex.org/covers/${slug}/${coverArt}`;

        const { data: { data: chaptersData } } = await axios({
            url: `https://api.mangadex.org/manga/${slug}/feed?translatedLanguage[]=vi&order[chapter]=asc&limit=500`,
            method: 'get'
        });

        const chapterArray: Chapter[] = chaptersData.map((chapter: any) => ({
            id: chapter.id,
            volume: chapter.attributes.volume,
            chapterNumber: chapter.attributes.chapter,
            title: chapter.attributes.title,
            groupId: chapter.relationships.find((r: any) => r.type === "scanlation_group")?.id || "99c579c7-935b-4bc5-a8e8-a46da371462b",
            release_date: chapter.attributes.createdAt,
            last_updated: chapter.attributes.updatedAt
        }));

        const groupIdArray = uniq(chapterArray.map(c => c.groupId));
        const groupIdToNumber: { [key: string]: number } = {};
        const groups: any = {};
        groupIdArray.forEach((groupId, index) => { groupIdToNumber[groupId] = index; groups[index] = groupId; });

        const chapters: any = {};
        chapterArray.forEach(({ id, volume, chapterNumber, title, groupId, release_date, last_updated }) => {
            const groupNumber = groupIdToNumber[groupId];
            if (!chapters[chapterNumber]) chapters[chapterNumber] = {};
            if (!chapters[chapterNumber].volume) chapters[chapterNumber].volume = volume;
            if (!chapters[chapterNumber].title) chapters[chapterNumber].title = title;
            if (!chapters[chapterNumber].last_updated) chapters[chapterNumber].last_updated = Date.parse(last_updated);

            if (!chapters[chapterNumber].groups) chapters[chapterNumber].groups = {};
            chapters[chapterNumber].groups[groupNumber] = `/read/api/mangadex/chapter/${id}`;
        });

        returnData.chapters = chapters;
        returnData.groups = groups;
        returnData.chapterNumbers = Object.keys(chapters);
        returnData.groupNumbers = Object.keys(groups);
        return returnData;
    }

    const url = `https://cubari.moe/read/api/${source}/series/${slug}/`;
    const { data } = await axios({
        url: url,
        method: 'get',
    });
    Object.assign(data, {
        staff: uniq([data.author, data.artist]).filter(s => Boolean(s)),
        source,
        chapterNumbers: Object.keys(data.chapters),
        groupNumbers: Object.keys(data.groups),
    });
    return data;
};

export { getTitleApi };