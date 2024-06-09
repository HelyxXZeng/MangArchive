import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./SearchMangaPage.scss";
import MangaCard from "../title/TitleCard2";
import searchManga from "../../utils/MangaSearch";
import TriStateCheckbox from "./TriStateCheckbox"; // Adjust the path as necessary

const MangaSearchPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const title = queryParams.get("title") || "";
    const includedTags = queryParams.getAll("includedTags");
    const excludedTags = queryParams.getAll("excludedTags");

    const [mangaTags, setMangaTags] = useState<any[]>([]);
    const [thisIncludedTags, setThisIncludedTags] = useState<string[]>(includedTags);
    const [thisExcludedTags, setThisExcludedTags] = useState<string[]>(excludedTags);

    const [mangaList, setMangaList] = useState<any[]>([]);
    const [limit] = useState<number>(20); // Number of items per page
    const [offset, setOffset] = useState<number>(0); // Current offset
    const [totalCount, setTotalCount] = useState<number>(0); // Total number of items

    const [searchInput, setSearchInput] = useState<string>(title);
    const [show, setShow] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageInput, setPageInput] = useState<string>("1");
    const [totalPages, setTotalPages] = useState<number>(1);

    // Fetch tags only once
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const baseUrl = "https://api.mangadex.org";
                const tags = await axios.get(`${baseUrl}/manga/tag`);
                setMangaTags(tags.data.data);
                setError(null);
            } catch (err) {
                setError("Error fetching tags. Please refresh the page.");
            }
        };

        fetchTags();
    }, []);

    // Fetch manga data based on location and pagination changes
    useEffect(() => {
        const fetchMangaData = async () => {
            try {
                const mangas = await searchManga(
                    title,
                    limit,
                    offset,
                    "",
                    [],
                    [],
                    0,
                    [],
                    [],
                    [],
                    [],
                    ["safe", "suggestive", "erotica", "pornographic"],
                    excludedTags,
                    "OR",
                    includedTags,
                    "AND"
                );
                setMangaList(mangas.data);

                if (mangas.data.length > 0) {
                    const total = parseInt(mangas.total, 10);
                    setTotalCount(total); // Update total count
                    setTotalPages(Math.ceil(total / limit));
                } else {
                    setTotalCount(0); // Update total count
                    setTotalPages(0);
                }

                setError(null);
            } catch (err) {
                setError("Error fetching data. Please refresh the page.");
            }
        };

        fetchMangaData();
    }, [title, limit, offset, location]);

    const handleSearchPress = () => {
        const params = new URLSearchParams();
        if (searchInput) params.append("title", searchInput);
        thisIncludedTags.forEach((tag) => params.append("includedTags", tag));
        thisExcludedTags.forEach((tag) => params.append("excludedTags", tag));
        setMangaList([]);
        navigate(`/search?${params.toString()}`);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    const onShow = () => {
        setShow(!show);
    };

    const handleTagChange = (id: string, state: "yes" | "no" | "unchecked") => {
        if (state === "yes") {
            setThisIncludedTags((prev) => [...prev, id]);
            setThisExcludedTags((prev) => prev.filter((tagId) => tagId !== id));
        } else if (state === "no") {
            setThisExcludedTags((prev) => [...prev, id]);
            setThisIncludedTags((prev) => prev.filter((tagId) => tagId !== id));
        } else {
            setThisIncludedTags((prev) => prev.filter((tagId) => tagId !== id));
            setThisExcludedTags((prev) => prev.filter((tagId) => tagId !== id));
        }
    };

    const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "" || (/^\d+$/.test(value) && parseInt(value) <= totalPages)) {
            setPageInput(value);
            setOffset((parseInt(value) - 1) * limit || 0);
        }
    };

    const handlePageInputBlur = () => {
        const pageNumber = parseInt(pageInput);
        if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            setOffset((pageNumber - 1) * limit);
        } else {
            setPageInput("1");
            setOffset(0);
        }
    };

    const handleNext = () => {
        if (offset + limit < totalCount) {
            setOffset((prevOffset) => prevOffset + limit);
            setCurrentPage((prevPage) => prevPage + 1);
            setPageInput((prev) => String(parseInt(prev) + 1));
        }
    };

    const handlePrevious = () => {
        if (offset > 0) {
            setOffset((prevOffset) => prevOffset - limit);
            setCurrentPage((prevPage) => prevPage - 1);
            setPageInput((prev) => String(parseInt(prev) - 1));
        }
    };

    return (
        <div className="search-page">
            {error && <div className="error-message">{error}</div>}
            {mangaTags && mangaTags.length > 0 && (
                <>
                    <div className={`tag-checkboxes ${show ? "show" : ""}`}>
                        {mangaTags.map((tag) => (
                            <TriStateCheckbox
                                key={tag.id}
                                tag={tag}
                                includedTags={thisIncludedTags}
                                excludedTags={thisExcludedTags}
                                onChange={handleTagChange}
                            />
                        ))}
                    </div>
                    <div className="searchbar">
                        <button className="searchicon" onClick={handleSearchPress}>
                            <img src="/icons/searchiconbar.svg" alt="Search Icon" />
                        </button>
                        <input
                            type="text"
                            placeholder="Search something!"
                            spellCheck="false"
                            value={searchInput}
                            onChange={handleSearchChange}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSearchPress();
                            }}
                        />
                        <div className="verticaldotline"></div>
                        <button className="filter">
                            <img src="/icons/filter.svg" alt="Filter Icon" onClick={onShow} />
                        </button>
                    </div>
                    <button className="search-button" onClick={handleSearchPress}>
                        Search
                    </button>
                </>
            )}

            {mangaList && mangaList.length === 0 && !error ? (
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
                            {mangaList && mangaList.map((manga) => (
                                <MangaCard key={manga.id} manga={manga} />
                            ))}
                        </div>
                    </div>

                    <div className="chapter-pagination">
                        {currentPage > 1 && (
                            <button
                                className="previous-chapter-page"
                                onClick={handlePrevious}
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
                            <button className="next-chapter-page" onClick={handleNext}>
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
