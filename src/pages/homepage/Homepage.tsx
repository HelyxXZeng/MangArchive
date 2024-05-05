import { useState, useEffect } from 'react';
import axios from 'axios';
import "./Homepage.scss";
import Manga from "../manga/Manga";

interface Manga {
  id: string;
  title: string;
}
const baseUrl = 'https://api.mangadex.org';
const title = 'Kanojyo to Himitsu to Koimoyou';
const Homepage = () => {
  const [mangaList, setMangaList] = useState([]);
  // const [mangaSlugs, setMangaSlugs] = useState<{ [key: string]: string | null }>({});

  const getMainPageMangas = async () => {
    try {
      const resp = await axios({
        method: 'GET',
        url: `${baseUrl}/manga`,
        params: {
          title: title
        }
      });

      console.log(resp.data.data.map((manga: any) => manga.id));
      setMangaList(resp.data.data);

      if (!resp) {
        throw new Error('Responses not found.');
      }
    } catch (error) {
      console.error('Error fetching responses:', error);
    }
  };
  useEffect(() => {
    getMainPageMangas();
    // axios.get('https://api.mangadex.org/manga')
    //   .then(response => {
    //     console.table(response.data.results);
    //     setMangaList(response.data.results);
    //     fetchMangaSlugs(response.data.results);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching manga list:', error);
    //   });
  }, []);

  // const fetchMangaSlugs = async (mangaList : Manga[]) => {
  //   const newSlugs: { [key: string]: string | null } = {};
  //   for (const manga of mangaList) {
  //     try {
  //       const response = await axios.get(`https://api.mangadex.org/manga/${manga.id}`);
  //       newSlugs[manga.id] = response.data.data.attributes.slug;
  //     } catch (error) {
  //       console.error('Error fetching manga slug:', error);
  //       newSlugs[manga.id] = null;
  //     }
  //   }
  //   setMangaSlugs(newSlugs);
  // };

  return (
    <div className="mainHomepage">
      <div>
        <h1>Manga List</h1>
        <ul>
          {mangaList && mangaList.map((manga: any) => (
            <li key={manga.id}>
              <p>Title: {manga.attributes.title.en}</p>
              {/* <p>Slug: {mangaSlugs[manga.id]}</p> */}
            </li>
          ))}
        </ul>
      </div>
      <Manga />
    </div>
  );
}

export default Homepage;
