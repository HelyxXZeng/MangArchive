import { useState, useEffect } from "react";
// import axios from "axios";
import { useLocation } from "react-router-dom";
import "./SearchMangaPage.scss";
import MangaCard from "../title/TitleCard2";
import searchManga from "../../utils/MangaSearch";

const MangaSearchPage: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const title = queryParams.get("title") || "";

    const [mangaList, setMangaList] = useState<any[]>([]);
    const [limit] = useState<number>(20); // Number of items per page
    const [offset, setOffset] = useState<number>(0); // Current offset
    const [totalCount, setTotalCount] = useState<number>(0); // Total number of items

    const [currentPage, setCurrentPage] = useState(1);
    const [pageInput, setPageInput] = useState("1");
    const [totalPages, setTotalPages] = useState(1);

    const getMangaData = async (this_title: string, limit: number, offset: number) => {
        // if (!title) return; // Ensure title is present

        const mangas = await searchManga(this_title, limit, offset);
        setMangaList(mangas.data);

        if (mangas.data.length > 0) {
            setTotalCount(parseInt(mangas.total, 10)); // Update total count
            setTotalPages(Math.ceil(parseInt(mangas.total, 10) / limit));
        }
        else {
            setTotalCount(0); // Update total count
            setTotalPages(0);
        }

        // try {
        //     const responses = await Promise.all(
        //         mangaIds.map((id: any) =>
        //             axios.get(`https://api.mangadex.org/manga/${id}?includes[]=cover_art&includes[]=author&includes[]=artist`)
        //         )
        //     );

        //     const fetchedMangas = responses.map((response: any) => response.data.data);
        //     setMangaList(fetchedMangas);

        //     if (!fetchedMangas.length) {
        //         throw new Error("Mangas not found.");
        //     }
        // } catch (error) {
        //     console.error("Error fetching mangas:", error);
        // }
    };

    // Pagination logic

    const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (
            value === "" ||
            (/^\d+$/.test(value) && parseInt(value) <= totalPages)
        ) {
            setPageInput(value);
            setOffset((parseInt(value) - 1) * limit || 0);
        }
    };

    const handlePageInputBlur = () => {
        if (pageInput === "" || parseInt(pageInput) < 1) {
            setPageInput("1");
            setOffset(0);
        }
        const pageNumber = parseInt(pageInput);
        if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            setOffset((pageNumber - 1) * limit);
        }
    };

    useEffect(() => {
        getMangaData(title, limit, offset);
    }, [title, limit, offset]);

    const handleNext = () => {
        if (offset + limit < totalCount) {
            setOffset((prevOffset) => prevOffset + limit);
            setCurrentPage(currentPage + 1);
            setPageInput(String(parseInt(pageInput) + 1));
        }
    };

    const handlePrevious = () => {
        if (offset > 0) {
            setOffset((prevOffset) => prevOffset - limit);
            setCurrentPage(currentPage - 1);
            setPageInput(String(parseInt(pageInput) - 1));
        }
    };

    // const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const newPage = parseInt(e.target.value, 10);
    //     if (!isNaN(newPage) && newPage > 0 && newPage <= Math.ceil(totalCount / limit)) {
    //         setOffset((newPage - 1) * limit);
    //     }
    // };

    return (
        <div className="search-page">
            {!mangaList ? (
                <div className="loading-wave">
                    <div className="loading-bar"></div>
                    <div className="loading-bar"></div>
                    <div className="loading-bar"></div>
                    <div className="loading-bar"></div>
                </div>
            ) : (
                <div>
                    <div className="manga-grid-container">
                        <div className="manga-grid">
                            {mangaList.map((manga) => (
                                <MangaCard key={manga.id} manga={manga} />
                            ))}
                        </div>
                    </div>

                    <div className="chapter-pagination">
                        {currentPage > 1 && (
                            <button
                                className="previous-chapter-page"
                                onClick={() => handlePrevious()}
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
                                onClick={() => handleNext()}
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MangaSearchPage;
