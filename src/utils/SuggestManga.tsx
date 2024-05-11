import axios from 'axios';

function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export const suggestManga = async () => {
    
    const baseUrl = 'https://api.mangadex.org';

    const currentDate = new Date();
    const previousMonthDate = new Date(currentDate);
    previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);

    try {
        const resp = await axios.get(`https://api.mangadex.org/manga?includes[]=cover_art&includes[]=artist&includes[]=author&order[followedCount]=desc&contentRating[]=safe&contentRating[]=suggestive&hasAvailableChapters=true&createdAtSince=${formatDate(previousMonthDate)}T22%3A15%3A37`, {
            params: {
                // createdAtSince: '2024-04-01T23%3A59%3A59',
                limit: 5,
            }
        });
        
        return resp.data.data;
    } catch (error) {
        console.error("Error searching manga:", error);
        return [];
    }
};