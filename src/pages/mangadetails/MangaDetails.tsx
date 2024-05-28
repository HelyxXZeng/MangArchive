import React, { useState, useEffect } from "react";
import axios from "axios";
import MangaBanner from "../mangabanner/MangaBanner";
import "./MangaDetails.scss";
import { getDataApi } from "../../utils/MangaData";
import Chapter from "../chaptercomponent/Chapter";
import { useParams } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import CustomSelect from "../../components/mangaComponents/customSelection/CustomSelect";

interface Props { }

const MangaDetails: React.FC<Props> = () => {
    const { manga_id } = useParams<{ manga_id: string }>();
    const [manga, setManga] = useState<any>(null);
    const [data, setData] = useState<any>(null);

    const [activeButton, setActiveButton] = useState("chapters");

    const [currentPage, setCurrentPage] = useState(1);
    const [pageInput, setPageInput] = useState("1");
    const chaptersPerPage = 10;

    const [collection, setCollection] = useState('');

    const [userID, setUserID] = useState(null);

    const handleButtonClick = (buttonName: string) => {
        setActiveButton(buttonName);
    };

    const getData = async () => {
        try {
            const {
                data: { data: fetchData },
            } = await axios({
                method: "GET",
                url: `https://api.mangadex.org/manga/${manga_id}?includes[]=cover_art&includes[]=author&includes[]=artist`,
            });
            console.log("Manga data fetched successfully: ", fetchData);
            setManga(fetchData);

            if (!fetchData) {
                throw new Error("Manga not found.");
            }
        } catch (error) {
            console.error("Error fetching manga:", error);
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
    }, [manga_id]);

    useEffect(() => {
        async function getUser() {
            try {
                const { data: sessionData, error: sessionError } = await supabase.auth.refreshSession();
                if (sessionError) {
                    console.error(sessionError);
                    return;
                }
                if (sessionData && sessionData.user) {
                    console.log(sessionData.user.email);

                    let { data, error } = await supabase
                        .rpc('get_user_id_by_email', {
                            p_email: sessionData.user.email
                        })
                    if (error) console.error(error)
                    else {
                        setUserID(data)
                        console.log('User ID: ', data);
                    }
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }
        getUser();
    }, []);

    useEffect(() => {
        addCollection();
    }, [collection]);

    useEffect(() => {
        getCollection();
    }, [userID]);

    async function addCollection() {
        if (collection) {
            let { data, error } = await supabase
                .rpc('add_to_collection', {
                    this_collection_name: collection,
                    this_slug: manga_id,
                    this_user_id: userID,
                })
            if (error) console.error(error);
            else getCollection();
        }
        else getCollection();
    }

    async function getCollection() {
        let { data, error } = await supabase
            .rpc('get_collection_for_manga', {
                this_slug: manga_id,
                this_user_id: userID,
            })
        if (error) console.error(error);
        else console.log('this collection is: ', data);
        setCollection(data);
    }

    // Pagination logic
    const indexOfLastChapter = currentPage * chaptersPerPage;
    const indexOfFirstChapter = indexOfLastChapter - chaptersPerPage;
    const currentChapters = data
        ? data.chapterNumbers.slice(indexOfFirstChapter, indexOfLastChapter)
        : [];

    const totalPages = data
        ? Math.ceil(data.chapterNumbers.length / chaptersPerPage)
        : 1;

    const paginate = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            setPageInput(String(pageNumber));
        }
    };

    const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (
            value === "" ||
            (/^\d+$/.test(value) && parseInt(value) <= totalPages)
        ) {
            setPageInput(value);
        }
    };

    const handlePageInputBlur = () => {
        if (pageInput === "" || parseInt(pageInput) < 1) {
            setPageInput("1");
        }
        const pageNumber = parseInt(pageInput);
        if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className="manga-details-page">
            {!(manga && data) ? (
                <div className="loading-wave">
                    <div className="loading-bar"></div>
                    <div className="loading-bar"></div>
                    <div className="loading-bar"></div>
                    <div className="loading-bar"></div>
                </div>
            ) : (
                <div style={{ width: "100%" }}>
                    {manga && <MangaBanner manga={manga} />}

                    <div className="choose-collection">
                        <CustomSelect
                            options={[
                                'ADD TO COLLECTION',
                                'READING',
                                'COMPLETED',
                                'ON-HOLD',
                                'DROPPED',
                                'PLAN-TO-READ',
                                'RE-READING',
                            ]}
                            value={collection === '' ? 'ADD TO COLLECTION' : collection}
                            onChange={(option: any) => (option === 'ADD TO COLLECTION') ? setCollection('') : setCollection(option)}
                        />
                    </div>

                    {manga && <p>{manga.attributes.description.en}</p>}

                    <div className="info-data-container">
                        <div className="more-info-container">
                            <span style={{ color: "white", marginLeft: "20px" }}>More Infos</span>
                            <span style={{ color: "white", marginLeft: "20px" }}>Status: {manga.attributes.status}</span>
                        </div>
                        <div className="chapter-container">
                            <div className="manga-details-nav-button-bar">
                                <div
                                    className={`chapters-nav-button ${activeButton === "chapters" ? "active" : ""
                                        }`}
                                    onClick={() => handleButtonClick("chapters")}
                                    style={{
                                        borderTopLeftRadius: "8px",
                                        borderBottomLeftRadius: "8px",
                                    }}
                                >
                                    Chapters
                                </div>
                                <div
                                    className={`comments-nav-button ${activeButton === "comments" ? "active" : ""
                                        }`}
                                    onClick={() => handleButtonClick("comments")}
                                >
                                    Comments
                                </div>
                                <div
                                    className={`posts-nav-button ${activeButton === "posts" ? "active" : ""
                                        }`}
                                    onClick={() => handleButtonClick("posts")}
                                    style={{
                                        borderTopRightRadius: "8px",
                                        borderBottomRightRadius: "8px",
                                    }}
                                >
                                    Posts
                                </div>
                            </div>
                            {activeButton === "chapters" && data && (
                                <div
                                    style={{
                                        width: "100%",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    {currentChapters.map((chap: any) => (
                                        <Chapter
                                            key={chap}
                                            chapterNumber={chap}
                                            data={data.chapters[chap]}
                                        />
                                    ))}

                                    <div className="chapter-pagination">
                                        {currentPage > 1 && (
                                            <button
                                                className="previous-chapter-page"
                                                onClick={() => paginate(currentPage - 1)}
                                            >
                                                Previous
                                            </button>
                                        )}
                                        <input
                                            type="text"
                                            value={pageInput}
                                            onChange={handlePageInputChange}
                                            onBlur={handlePageInputBlur}
                                            style={{
                                                width: "40px",
                                                textAlign: "center",
                                                borderRadius: "4px",
                                            }}
                                        />
                                        <span> / {totalPages}</span>
                                        {currentPage < totalPages && (
                                            <button
                                                className="next-chapter-page"
                                                onClick={() => paginate(currentPage + 1)}
                                            >
                                                Next
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeButton === "comments" && (
                                <div className="manga-details-comments-container">
                                    There is no comment yet
                                </div>
                            )}

                            {activeButton === "posts" && (
                                <div className="manga-details-comments-container">
                                    There is no post yet
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
            )}
        </div>
    );
};

export default MangaDetails;
