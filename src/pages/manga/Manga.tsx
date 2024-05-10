import { useState, useEffect } from 'react';
import axios from 'axios';
import './Manga.scss';
// import searchManga from './MangaSearch.js';

import MangaCard from '../title/TitleCard2';
import BannerSwiper from '../bannerswiper/BannerSwiper';
import MangaCardSwiper from '../mangaswiper/MangaSwiper';
import MangaBanner from '../mangabanner/MangaBanner';
import { suggestManga } from '../../utils/SuggestManga';
// import Banner from '../banner/Banner';

const Manga = () => {
  const [mangaList, setMangaList] = useState([]);
  const [suggestMangas, setSuggestManga] = useState([]);
  // const [mangaSlugs, setMangaSlugs] = useState({});
  
  const baseUrl = 'https://api.mangadex.org';
  // const title = 'Kanojyo to Himitsu to Koimoyou';
  const getMainPageMangas = async () => {
    try {
      const resp = await axios({
          method: 'GET',
          url: `${baseUrl}/manga?includes[]=cover_art&includes[]=author&includes[]=artist`,
          params: {
            limit: 10,
            offset: 0
          }
      });
      console.log("log2: ", resp.data.data);
      setMangaList(resp.data.data);
      setSuggestManga(await suggestManga());

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
      <div className="banner">
        {/* <h1>Welcome to My Website</h1> */}
        {mangaList.length > 0 &&
          <BannerSwiper banners={suggestMangas} />
        }
      </div>
      <div className="textbox">
        <h1>Recent Uploaded</h1>
      </div>
      {mangaList.length > 0 &&
        <MangaBanner manga={mangaList[0]} rank={1}/>
      }
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
        {/* {mangaList && mangaList.map((manga, index) => (
          <MangaCard key={index} manga={manga} />
          // <TitleCardSkeleton></TitleCardSkeleton>
        ))} */}
        <MangaCardSwiper mangas={mangaList} />
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