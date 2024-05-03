import { useState, useEffect } from 'react';
import axios from 'axios';
import searchManga from './MangaSearch.js';

const Manga = () => {
  const [mangaList, setMangaList] = useState([]);
  // const [mangaSlugs, setMangaSlugs] = useState({});
  
  const baseUrl = 'https://api.mangadex.org';
  const title = 'Kanojyo to Himitsu to Koimoyou';
  const getMainPageMangas = async () => {
    try {
      const resp = await axios({
          method: 'GET',
          url: `${baseUrl}/manga?includes[]=cover_art`,
          params: {
            limit: 100,
            offset: 0
          }
      });
      console.log("log1: ", resp.data.data.map((manga: any) => manga.id));

      console.log("log2: ", resp.data.data);
      setMangaList(resp.data.data);

      if (!resp) {
          throw new Error('Responses not found.');
      }
    } catch (error) {
    console.error('Error fetching responses:', error);
    }

    try {
      const mangaIds = await searchManga(title);
      console.log("logSpecial: ", mangaIds);
    } catch (error) {
        console.error("Error:", error);
    }
  };
  useEffect(() => {
      getMainPageMangas();
  }, []);

  return (
    <div className="mainHomepage">
      <div className="textbox">
        <h1>Manga List</h1>
      </div>
      <ul>
          {mangaList && mangaList.map((manga: any) => (
            <li key={manga.id}>
              <p>Title: {manga.attributes.title.en}</p>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Manga;