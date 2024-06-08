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

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageInput, setPageInput] = useState<string>("1");
    const [totalPages, setTotalPages] = useState<number>(1);

    const getMangaData = async (
        this_title: string,
        limit: number,
        offset: number,
        includedTags: string[],
        excludedTags: string[]
    ) => {
        if (mangaList && mangaList.length > 0) return;
        const mangas = await searchManga(
            this_title,
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

        const baseUrl = 'https://api.mangadex.org';
        const tags = await axios.get(`${baseUrl}/manga/tag`);

        setMangaTags(tags.data.data);
        // console.log('Tags:', tags.data.data);
    };

    const handleSearchPress = () => {
        const params = new URLSearchParams();
        params.append("title", title);
        thisIncludedTags.forEach(tag => params.append("includedTags", tag));
        thisExcludedTags.forEach(tag => params.append("excludedTags", tag));
        setMangaList([]);
        navigate(`/search?${params.toString()}`);
    };

    const handleTagChange = (id: string, state: 'yes' | 'no' | 'unchecked') => {
        if (state === 'yes') {
            setThisIncludedTags(prev => [...prev, id]);
            setThisExcludedTags(prev => prev.filter(tagId => tagId !== id));
        } else if (state === 'no') {
            setThisExcludedTags(prev => [...prev, id]);
            setThisIncludedTags(prev => prev.filter(tagId => tagId !== id));
        } else {
            setThisIncludedTags(prev => prev.filter(tagId => tagId !== id));
            setThisExcludedTags(prev => prev.filter(tagId => tagId !== id));
        }
    };

    useEffect(() => {
        setMangaList([]);
    }, [location]);

    useEffect(() => {
        getMangaData(title, limit, offset, includedTags, excludedTags);
    }, [title, limit, offset, includedTags, excludedTags, mangaList]);

    const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "" || (/^\d+$/.test(value) && parseInt(value) <= totalPages)) {
            setPageInput(value);
            setOffset((parseInt(value) - 1) * limit || 0);
        }
    };

    const handlePageInputBlur = () => {
        setMangaList([]);
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
        setMangaList([]);
        if (offset + limit < totalCount) {
            setOffset(prevOffset => prevOffset + limit);
            setCurrentPage(prevPage => prevPage + 1);
            setPageInput(prev => String(parseInt(prev) + 1));
        }
    };

    const handlePrevious = () => {
        setMangaList([]);
        if (offset > 0) {
            setOffset(prevOffset => prevOffset - limit);
            setCurrentPage(prevPage => prevPage - 1);
            setPageInput(prev => String(parseInt(prev) - 1));
        }
    };

    return (
        <div className="search-page">
            {mangaList && mangaList.length > 0 &&
                <div className="tag-checkboxes">
                    {mangaTags.map(tag => (
                        <TriStateCheckbox
                            key={tag.id}
                            tag={tag}
                            includedTags={thisIncludedTags}
                            excludedTags={thisExcludedTags}
                            onChange={handleTagChange}
                        />
                    ))}
                    <button className="search-button" onClick={handleSearchPress}>
                        Search
                    </button>
                </div>
            }

            {!(mangaList && mangaList.length > 0) ? (
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
                            <button
                                className="next-chapter-page"
                                onClick={handleNext}
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
