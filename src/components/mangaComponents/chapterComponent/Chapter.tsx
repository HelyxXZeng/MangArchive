import React, { useState, useEffect } from "react";
import "./Chapter.scss";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../utils/supabase";

interface Props {
  chapterNumber: any;
  data: any;
  mangaID: any;
  userID: any;
}

const Chapter: React.FC<Props> = ({ data, chapterNumber, mangaID, userID }) => {
  const [show, setShow] = useState(true);
  const [bookmarks, setBookmarks] = useState<{ [key: number]: boolean }>({});
  const navigate = useNavigate();

  const getBookmark = async (chapterNumber: any, translatedLanguage: any) => {
    if (userID) {
      const { data, error } = await supabase.rpc("get_bookmark", {
        this_user_id: userID,
        this_chap: chapterNumber,
        this_language: translatedLanguage,
        this_truyen: mangaID,
      });

      if (error) {
        console.error(error);
        return false;
      }

      return data ? true : false;
    }

    return false;
  };

  const addBookmark = async (chapterNumber: any, translatedLanguage: any) => {
    if (userID) {
      console.log(
        `Bookmark added for Chapter ${chapterNumber} in ${translatedLanguage}`
      );
      const { error } = await supabase.rpc("add_bookmark", {
        this_user_id: userID,
        this_chap: chapterNumber,
        this_language: translatedLanguage,
        this_truyen: mangaID,
      });

      if (error) console.error(error);
    }
  };

  const handleNavLinkClick = async (
    chapterNumber: any,
    translatedLanguage: any,
    chapID: any
  ) => {
    await addBookmark(chapterNumber, translatedLanguage);
    navigate(`/chapter/${chapterNumber}/${chapID}`);
  };

  const onShow = () => {
    setShow(!show);
  };

  useEffect(() => {
    data.forEach(async (chap: any) => {
      const isBookmarked = await getBookmark(
        chapterNumber,
        chap.translatedLanguage
      );
      setBookmarks((prev) => ({ ...prev, [chap.id]: isBookmarked }));
    });
  }, [chapterNumber, data, mangaID, userID]);

  return (
    <div className="chapter-card">
      <div className="chapter-number" onClick={onShow}>
        <h2>{"Chapter " + chapterNumber}</h2>
      </div>
      {data.map((chap: any, index: number) => (
        <div className={`chapter-data ${show ? "show" : ""}`} key={index}>
          <div
            style={{
              width: "5px",
              backgroundColor: "yellow",
              display: "none",
            }}
          ></div>
          <img
            src={bookmarks[chap.id] ? "/icons/eye-slash.svg" : "/icons/eye.svg"}
            alt="icon"
            style={{ marginRight: "5px" }}
          />
          <h3>{chap.translatedLanguage}</h3>
          <div style={{ width: "85%" }}>
            <div
              onClick={() =>
                handleNavLinkClick(
                  chapterNumber,
                  chap.translatedLanguage,
                  chap.id
                )
              }
              style={{
                width: "100%",
                textDecoration: "none",
                justifyContent: "space-between",
                display: "flex",
                cursor: "pointer",
              }}
            >
              <p>{chap.title ? chap.title : "Ch." + chapterNumber}</p>
              <h2>{chap.volume ? "Volume " + chap.volume : "No volume"}</h2>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chapter;
