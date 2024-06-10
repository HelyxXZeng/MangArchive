import { NavLink } from "react-router-dom";
import UserCardSmall from "../userCardSmall/UserCardSmall";
import "./rightBar.scss";
import ComicCard from "../comicCardSmall/ComicCard";
import { suggestManga } from "../../../utils/SuggestManga"
import { useEffect, useState } from "react";
const RightBar = () => {
  const [comics, setComics] = useState([]);

  useEffect(() => {
    // Fetch comic data from the API
    const fetchComics = async () => {
      try {
        const comicData = await suggestManga(); // Assuming suggestManga returns an array of comic data
        setComics(comicData);
      } catch (error) {
        console.error("Error fetching comics:", error);
      }
    };

    fetchComics();
  }, []);
  return (
    <div className="rightBarContainer">
      <div className="sugesstCard">
        <h1>Who to follow</h1>
        {["HuyềnTrang92", "QuangNam1987", "AnhThu2203"].map((name, index) => (
          <div key={index}>
            <UserCardSmall name={name.toString()} />
          </div>
        ))}
        <NavLink to="/discover/connect_people" className="seeMoreLink">
          See more
        </NavLink>
      </div>
      <div className="sugesstCard">
        <h1>Translation groups</h1>
        {["Thiên Hạ truyện", "Nhà của Meow", "Mộng Tiên Giới"].map((name, index) => (
          <div key={index}>
            <UserCardSmall name={name} />
          </div>
        ))}
        <NavLink to="/discover/connect_group" className="seeMoreLink">
          See more
        </NavLink>
      </div>
      <div className="trend sugesstCard">
        <h1>Trends</h1>
        {comics.map((comic: any, index: any) => (
            <ComicCard
              key={index}
              cover={comic.relationships.find((r: any) => r.type === "cover_art")?.attributes.fileName}
              title={comic.attributes.title.en}
              comictype={comic.type}
              maintag={comic.attributes.tags[0].attributes.name.en}
              id={comic.id}
            />
        ))}
        <NavLink to="/i/latest/discover" className="seeMoreLink">
          See more
        </NavLink>
      </div>
    </div>
  );
};

export default RightBar;
