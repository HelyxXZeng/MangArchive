import { useState, useEffect } from "react";
import axios from "axios";
import "./Manga.scss";
import { useNavigate } from "react-router-dom";
// import searchManga from './MangaSearch.js';

import MangaCard from "../title/TitleCard2";
import BannerSwiper from "../bannerswiper/BannerSwiper";
import MangaCardSwiper from "../mangaswiper/MangaSwiper";
// import MangaBanner from "../mangabanner/MangaBanner";
// import Banner from '../banner/Banner';
import { suggestManga } from "../../utils/SuggestManga";

const Manga = () => {
  const [mangaList, setMangaList] = useState([]);
  const [suggestMangas, setSuggestManga] = useState([]);
  // const [mangaSlugs, setMangaSlugs] = useState({});
  const navigate = useNavigate();

  const handleRandomClick = async () => {
    try {
      const resp = await axios({
        method: "GET",
        url: `${baseUrl}/manga/random`
      });
      console.log("random: ", resp.data.data);
      navigate(`/manga/${resp.data.data.id}`);

      if (!resp) {
        throw new Error("Manga not found.");
      }
    } catch (error) {
      console.error("Error fetching manga:", error);
    }
    // navigate(`/chapter/${chapID}`);
  };

  const baseUrl = "https://api.mangadex.org";
  // const title = 'Kanojyo to Himitsu to Koimoyou';
  const getMainPageMangas = async () => {
    try {
      const resp = await axios({
        method: "GET",
        url: `${baseUrl}/manga?includes[]=cover_art&includes[]=author&includes[]=artist`,
        params: {
          limit: 40,
          offset: 0,
          order: {
            latestUploadedChapter: "desc",
          },
        },
      });
      // console.log("log2: ", resp.data.data);
      setMangaList(resp.data.data);
      setSuggestManga(await suggestManga(10));

      if (!resp) {
        throw new Error("Mangas not found.");
      }
    } catch (error) {
      console.error("Error fetching mangas:", error);
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
      {!(mangaList && suggestMangas) ? (
        <div className="loading-wave">
          <div className="loading-bar"></div>
          <div className="loading-bar"></div>
          <div className="loading-bar"></div>
          <div className="loading-bar"></div>
        </div>
      ) : (
        <div>
          <div className="banner">
            {/* <h1>Welcome to My Website</h1> */}
            {suggestMangas.length > 0 && (
              <BannerSwiper banners={suggestMangas} />
            )}
          </div>

          <div className="textbox">
            <h1 style={{ paddingLeft: "20px" }}>
              <span>Recent </span>
              <span style={{ color: "#1B6FA8" }}>Updated</span>
            </h1>
          </div>

          {/* {mangaList.length > 0 && <MangaBanner manga={mangaList[0]} />} */}

          <div className="category-selection">
            <span>
              <div className="category-selection-tag">All Category</div>
            </span>
            <span>
              <div className="category-selection-tag">Shounen</div>
            </span>
            <span>
              <div className="category-selection-tag">Shoujo</div>
            </span>
            <span>
              <div className="category-selection-tag">Josei</div>
            </span>
            <span>
              <div className="category-selection-tag">Action</div>
            </span>
            <span>
              <div className="category-selection-tag">Mistery</div>
            </span>
            <span>
              <div className="category-selection-tag">Adventure</div>
            </span>
            <span>
              <div className="category-selection-tag">Fantasy</div>
            </span>
            <span>
              <div className="category-selection-tag">Dark Fantasy</div>
            </span>
            <span>
              <div className="category-selection-tag">Oneshot</div>
            </span>
            <span>
              <div className="category-selection-tag">Slice of Life</div>
            </span>
            <span>
              <div className="category-selection-tag">School Life</div>
            </span>
            <span>
              <div className="category-selection-tag">Romance</div>
            </span>
            <span>
              <div className="category-selection-tag">Drama</div>
            </span>
            <span>
              <div className="category-selection-tag">Comedy</div>
            </span>
            <span>
              <div className="category-selection-tag">Harem</div>
            </span>
            <span>
              <div className="category-selection-tag">Ecchi</div>
            </span>
          </div>

          <div className="manga-grid-container">
            <div className="manga-grid">
              {mangaList &&
                mangaList.map((manga: any) => (
                  <MangaCard key={manga.id} manga={manga} />
                ))}
            </div>
            <div className="textbox" onClick={() => handleRandomClick()}>
              <h1 style={{ paddingLeft: "20px" }}>
                <span style={{ color: "#E7E9EA" }}>Random </span>
                <span style={{ color: "#4296cf" }}>Manga</span>
              </h1>
            </div>
            <div className="horizontal-manga-list">
              {/* {mangaList && mangaList.map((manga, index) => (
                    <MangaCard key={index} manga={manga} />
                    // <TitleCardSkeleton></TitleCardSkeleton>
                    ))} */}
              {suggestMangas.length > 0 && (
                <MangaCardSwiper mangas={suggestMangas} />
              )}
            </div>
          </div>

          {/* <div className="horizontal-manga-list">
                  {suggestMangas.length > 0 && <MangaCardSwiper mangas={suggestMangas} />}
                </div> */}
        </div>
      )}
    </div>
  );
};

export default Manga;
