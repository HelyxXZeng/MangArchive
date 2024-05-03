import axios from 'axios';

const searchManga = async (title: string) => {
    const baseUrl = 'https://api.mangadex.org';

    try {
        const resp = await axios.get(`${baseUrl}/manga`, {
            params: {
                title: title
            }
        });
        
        return resp.data.data.map((manga: any) => manga.id);
    } catch (error) {
        console.error("Error searching manga:", error);
        return [];
    }
};

export default searchManga;