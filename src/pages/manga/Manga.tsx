import { useState, useEffect } from 'react';
import axios from 'axios';
import './Manga.scss';
// import searchManga from './MangaSearch.js';

import MangaCard from '../Title/TitleCard2';

// interface Manga {
//   id: string;
//   type: string;
//   attributes: {
//     title: {
//       en: string;
//     };
//     cover_art: string;
//     description: {
//       en: string;
//     };
//     tags: string[];
//   };
// }


const Manga = () => {
  const [mangaList, setMangaList] = useState([]);
  // const [mangaSlugs, setMangaSlugs] = useState({});
  
  const baseUrl = 'https://api.mangadex.org';
  // const title = 'Kanojyo to Himitsu to Koimoyou';
  const getMainPageMangas = async () => {
    try {
      const resp = await axios({
          method: 'GET',
          url: `${baseUrl}/manga?includes[]=cover_art`,
          params: {
            limit: 10,
            offset: 0
          }
      });
      console.log("log1: ", resp.data.data.map((manga: any) => manga.id));

      console.log("log2: ", resp.data.data);
      setMangaList(resp.data.data);

      if (!resp) {
          throw new Error('Mangas not found.');
      }
    } catch (error) {
    console.error('Error fetching mangas:', error);
    }

    // try {
    //   const mangaIds = await searchManga(title);
    //   console.log("logSpecial: ", mangaIds);
    // } catch (error) {
    //     console.error("Error:", error);
    // }
  };
  useEffect(() => {
      getMainPageMangas();
  }, []);

  return (
    <div className="mainPage">
      <div className="textbox">
        <h1>Recent Uploaded</h1>
      </div>
      {/* <ul>
          {mangaList && mangaList.map((manga: any) => (
            <li key={manga.id}>
              <p>Title: {manga.attributes.title.en}</p>
            </li>
          ))}
      </ul> */}
      <div className="manga-grid">
        {mangaList && mangaList.map((manga: any) => (
          <MangaCard key={manga.id} manga={manga} />
        ))}
      </div>

      <div className="horizontal-manga-list">
        {mangaList.map((manga, index) => (
          <MangaCard key={index} manga={manga} />
        ))}
      </div>

      {/* <ul className="ul-grid" style={{ width: '100%' }}>
          {mangaList && mangaList.map((manga: any) => (
            <li key={manga.id} className="li-griditems">
              <MangaCard key={manga.id} manga={manga} />
            </li>
          ))}
      </ul> */}

    </div>
  );
};

export default Manga;