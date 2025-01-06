import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./SearchMangaPage.scss";
import MangaCard from "../../components/mangaComponents/title/TitleCard2";
import searchManga from "../../utils/MangaSearch";
import TriStateCheckbox from "./checkbox/TriStateCheckbox"; // Adjust the path as necessary
import { useTranslation } from "react-i18next";
import { searchGroupAndUser } from "../../api/scocialAPI";
import UserCardLarge from "../../components/socialComponents/userCardLarge/UserCardLarge";
import GroupCardLarge from "../../components/socialComponents/group-card-large/GroupCardLarge";

const SearchMangaPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const title = queryParams.get("title") || "";
  let includedTags = queryParams.getAll("includedTags");
  let excludedTags = queryParams.getAll("excludedTags");

  const [mangaTags, setMangaTags] = useState<any[]>([]);
  const [thisIncludedTags, setThisIncludedTags] =
    useState<string[]>(includedTags);
  const [thisExcludedTags, setThisExcludedTags] =
    useState<string[]>(excludedTags);

  const [users, setUsers] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [mangaList, setMangaList] = useState<any[]>([]);
  const [limit] = useState<number>(20); // Number of items per page
  const [offset, setOffset] = useState<number>(0); // Current offset
  const [totalCount, setTotalCount] = useState<number>(0); // Total number of items
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const [searchInput, setSearchInput] = useState<string>(title);
  const [show, setShow] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageInput, setPageInput] = useState<string>("1");
  const [totalPages, setTotalPages] = useState<number>(1);
  const { t } = useTranslation("", { keyPrefix: "search-page" });

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
        ["safe", "suggestive", "erotica"],
        excludedTags,
        "OR",
        includedTags,
        "AND"
      );
      setMangaList(mangas.data);
      setIsCompleted(true);

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

  const fetchUsersAndGroups = async () => {
    try {
      const data = await searchGroupAndUser(title);
      const usersList: any[] = [];
      const groupsList: any[] = [];

      data.forEach((element: any) => {
        if (element.entity_type === 'User') {
          usersList.push(element);
        } else if (element.entity_type === 'Group') {
          groupsList.push(element);
        }
      });

      setUsers(usersList);
      setGroups(groupsList);

    } catch (err) {
      setError("Error fetching social data.");
    }
  };

  // Fetch manga data based on location and pagination changes
  useEffect(() => {
    setThisIncludedTags(includedTags);
    setThisExcludedTags(excludedTags);
    setSearchInput(title);

    fetchUsersAndGroups();
    fetchMangaData();
  }, [title, limit, offset, location]);

  // when search
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
    if (
      value === "" ||
      (/^\d+$/.test(value) && parseInt(value) <= totalPages)
    ) {
      setPageInput(value);
      // setOffset((parseInt(value) - 1) * limit || 0);
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
      {error && (
        <div className="error-message">{t("error-message", { error })}</div>
      )}
      {mangaTags && mangaTags.length > 0 && (
        <>
          <div className={`tag-checkboxes ${show ? "show" : ""}`}>
            <p style={{ color: "whitesmoke", width: "100%" }}>{t("tag-instruction")}</p>
            {thisIncludedTags &&
              thisExcludedTags &&
              mangaTags.map((tag) => (
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
              placeholder={t("search-placeholder")}
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
            {t("search-button")}
          </button>
        </>
      )}
      <div style={{ color: "whitesmoke", width: "90%" }}>
        <h2 style={{ color: "whitesmoke", width: "100%" }}>Groups</h2>
        {groups && groups.map((user) => (
          <GroupCardLarge
            key={user.entity_id}
            userID={user.entity_id}
            fetchSuggestUser={fetchUsersAndGroups}
          />
        ))}

        <h2 style={{ color: "whitesmoke", width: "100%" }}>Users</h2>
        {users && users.map((user) => (
          <UserCardLarge
            key={user.entity_id}
            userID={user.entity_id}
            fetchSuggestUser={fetchUsersAndGroups}
          />
        ))}
      </div>

      <h2 style={{ color: "whitesmoke", width: "100%", paddingLeft: "5%" }}>Manga</h2>

      {mangaList && mangaList.length === 0 && !error && !isCompleted ? (
        <div className="loading-wave">
          <div className="loading-bar"></div>
          <div className="loading-bar"></div>
          <div className="loading-bar"></div>
          <div className="loading-bar"></div>
        </div>
      ) : totalCount === 0 ? (
        <div className="error-message">{t("no-results")}</div>
      ) : (
        <div>
          <div className="manga-grid-container">
            <div className="manga-grid">
              {mangaList &&
                mangaList.map((manga) => (
                  <MangaCard
                    key={manga.id}
                    manga={manga}
                    includedTags={includedTags}
                  />
                ))}
            </div>
          </div>

          <div className="chapter-pagination">
            {currentPage > 1 && (
              <button
                className="previous-chapter-page"
                onClick={handlePrevious}
              >
                {t("previous-page")}
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
            <span>{t("pagination", { totalPages })}</span>
            {currentPage < totalPages && (
              <button className="next-chapter-page" onClick={handleNext}>
                {t("next-page")}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchMangaPage;
