import { useState, useEffect } from "react";
import axios from "axios";
// import Manga from "../manga/Manga";
import MangaBanner from "../mangabanner/MangaBanner";
import "./MangaDetails.scss";
import { getDataApi } from "../../utils/MangaData";
import Chapter from "../chaptercomponent/Chapter";
import { useParams } from "react-router-dom";

interface Props { }

const MangaDetails: React.FC<Props> = () => {
    const { manga_id } = useParams<{ manga_id: string }>();
    const [manga, setManga] = useState(null);
    const [data, setData] = useState<any>(null);

    const baseUrl = "https://api.mangadex.org";
    const getData = async () => {
        try {
            const {
                data: { data: fetchData },
            } = await axios({
                method: "GET",
                url: `https://api.mangadex.org/manga/${manga_id}?includes[]=cover_art&includes[]=author&includes[]=artist`,
                // params: {
                //   limit: 10,
                //   offset: 0
                // }
            });
            console.log("Manga data fetch sucessfully: ", fetchData);
            setManga(fetchData);

            if (!fetchData) {
                throw new Error("Mangas not found.");
            }
        } catch (error) {
            console.error("Error fetching mangas:", error);
        }

        getDataApi(manga_id)
            .then((returnData) => {
                console.log(returnData);
                setData(returnData);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="mainHomepage">
            {manga && <MangaBanner manga={manga} />}
            <div>
                {data &&
                    data.chapterNumbers.map((chap: any) => (
                        <Chapter chapterNumber={chap} data={data.chapters[chap]} />
                    ))}
            </div>

            <div>
                <button>
                    <span>Add To Library</span>
                </button>
                <div>
                    <div>
                        <button>
                            <span>Hello</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default MangaDetails;
