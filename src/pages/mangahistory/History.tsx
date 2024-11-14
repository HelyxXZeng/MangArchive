import React, { useState, useEffect } from "react";
import axios from "axios";
import "./History.scss";
import { useParams } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import MangaCard from "../title/TitleCard2";
import { fetchUserIdByEmail } from "../../api/userAPI";

interface Props {}

const MangaHistory: React.FC<Props> = () => {
  const { page } = useParams<{ page: string }>();
  const [data, setData] = useState<any>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const chaptersPerPage = 20;

  const [userID, setUserID] = useState(null);

  const getManga = async (page: any, userID: any) => {
    setData(null);
    let { data: spdata, error } = await supabase.rpc("get_history", {
      user_id: userID,
    });
    if (error) console.error(error);
    else {
      console.log("this collections mangas are: ", spdata);
      console.log("this page is: ", page);
      if (spdata.length > 0) {
        try {
          const {
            data: { data: fetchData },
          } = await axios({
            method: "GET",
            url: `https://api.mangadex.org/manga?includes[]=cover_art&includes[]=author&includes[]=artist`,
            params: {
              order: {
                latestUploadedChapter: "desc",
              },
              ids: spdata,
            },
          });
          console.log("Mangas data fetched successfully: ", fetchData);
          setData(fetchData);

          if (!fetchData) {
            throw new Error("Mangas not found.");
          }
        } catch (error) {
          console.error("Error fetching mangas:", error);
        }
      } else setData([]);
    }
  };

  useEffect(() => {
    getManga(page, userID);
  }, [page, userID]);

  useEffect(() => {
    async function getUser() {
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.refreshSession();
        if (sessionError) {
          console.error(sessionError);
          return;
        }
        if (sessionData && sessionData.user?.email) {
          let { data, error } = await fetchUserIdByEmail(
            sessionData.user.email
          );
          if (error) console.error(error);
          else {
            setUserID(data);
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    getUser();
  }, []);

  // Pagination logic
  const indexOfLastChapter = currentPage * chaptersPerPage;
  const indexOfFirstChapter = indexOfLastChapter - chaptersPerPage;
  const currentChapters = data
    ? data.slice(indexOfFirstChapter, indexOfLastChapter)
    : [];

  const totalPages = data ? Math.ceil(data.length / chaptersPerPage) : 1;

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
    <div>
      <div className="search-page">
        {!data ? (
          <div className="loading-wave">
            <div className="loading-bar"></div>
            <div className="loading-bar"></div>
            <div className="loading-bar"></div>
            <div className="loading-bar"></div>
          </div>
        ) : (
          <div style={{ width: "100%" }}>
            {data.length && (
              <div
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* {currentChapters.map((chap: any) => (
                                    <Chapter
                                        key={chap}
                                        chapterNumber={chap}
                                        data={data.chapters[chap]}
                                    />
                                ))} */}

                <div className="manga-grid-container">
                  <div className="manga-grid">
                    {currentChapters.map((manga: any) => (
                      <MangaCard key={manga.id} manga={manga} />
                    ))}
                  </div>
                </div>

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

            {!data.length && (
              <div className="manga-details-comments-container">
                There is no manga in this collection
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MangaHistory;
