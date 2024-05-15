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
    const [manga, setManga] = useState<any>(null);
    const [data, setData] = useState<any>(null);

    const [containerType, setContainerType] = useState("chapter");

    // const baseUrl = "https://api.mangadex.org";
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
                returnData.chapterNumbers.sort((a: any, b: any) => b - a);
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
        <div className="manga-details-page">
            {manga && <MangaBanner manga={manga} />}

            {manga && <p>{manga.attributes.description.en}</p>}

            <div className="info-data-container">
                <div className="more-info-container">
                    <span style={{ color: "white" }}>More Infos</span>
                </div>
                <div className="chapter-container">
                    {containerType === "chapter" && data && (
                        <div style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            {data.chapterNumbers.map((chap: any) => (
                                <Chapter chapterNumber={chap} data={data.chapters[chap]} />
                            ))}

                            <p>Hello World</p>
                        </div>
                    )}
                </div>
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
