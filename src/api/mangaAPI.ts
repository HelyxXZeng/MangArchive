import axios from "axios";

export const fetchMangaById = async (mangaId: string) => {
  try {
    const { data } = await axios.get(
      `https://api.mangadex.org/manga/${mangaId.trim()}?includes[]=cover_art&includes[]=artist&includes[]=author`
    );
    return data.data;
  } catch (error) {
    console.error("Error fetching manga by ID:", error);
    throw error;
  }
};
