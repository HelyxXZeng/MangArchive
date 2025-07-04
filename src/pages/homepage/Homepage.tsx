import "./Homepage.scss";
import Manga from "../manga/Manga";

interface Manga {
  id: string;
  title: string;
}
// const baseUrl = 'https://mangapi.alse.workers.dev/api/';
// const title = 'Kanojyo to Himitsu to Koimoyou';
const Homepage = () => {
  // const [mangaList, setMangaList] = useState([]);
  // // const [mangaSlugs, setMangaSlugs] = useState<{ [key: string]: string | null }>({});

  // const getMainPageMangas = async () => {
  //   try {
  //     const resp = await axios({
  //       method: 'GET',
  //       url: `${baseUrl}/manga`,
  //       params: {
  //         title: title
  //       }
  //     });

  //     console.log(resp.data.data.map((manga: any) => manga.id));
  //     setMangaList(resp.data.data);

  //     if (!resp) {
  //       throw new Error('Responses not found.');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching responses:', error);
  //   }
  // };
  // useEffect(() => {
  //   getMainPageMangas();
  //   // axios.get('https://mangapi.alse.workers.dev/api//manga')
  //   //   .then(response => {
  //   //     console.table(response.data.results);
  //   //     setMangaList(response.data.results);
  //   //     fetchMangaSlugs(response.data.results);
  //   //   })
  //   //   .catch(error => {
  //   //     console.error('Error fetching manga list:', error);
  //   //   });
  // }, []);

  // // const fetchMangaSlugs = async (mangaList : Manga[]) => {
  // //   const newSlugs: { [key: string]: string | null } = {};
  // //   for (const manga of mangaList) {
  // //     try {
  // //       const response = await axios.get(`https://mangapi.alse.workers.dev/api//manga/${manga.id}`);
  // //       newSlugs[manga.id] = response.data.data.attributes.slug;
  // //     } catch (error) {
  // //       console.error('Error fetching manga slug:', error);
  // //       newSlugs[manga.id] = null;
  // //     }
  // //   }
  // //   setMangaSlugs(newSlugs);
  // // };

  return (
    <div className="mainHomepage">
      <Manga />
      {/* <MangaDetails manga_id='3cbc4293-3623-470a-9405-f46b328c83d4'/> */}
    </div>
  );
};

export default Homepage;
