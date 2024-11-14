import { NavLink } from "react-router-dom";
import UserCardSmall from "../userCardSmall/UserCardSmall";
import "./rightBar.scss";
import ComicCard from "../comicCardSmall/ComicCard";
import { suggestManga } from "../../../utils/SuggestManga";
import { useEffect, useState } from "react";
import useCheckSession from "../../../hooks/session";
import {
  fetchMostSimilarUsers,
  fetchUserIdByEmail,
} from "../../../api/userAPI";
const RightBar = () => {
  const [comics, setComics] = useState([]);
  const [suggestUser, setSuggestUser] = useState<any>([]);
  const session = useCheckSession();
  const [userID, setUserID] = useState<any>(null);

  useEffect(() => {
    const getUserID = async () => {
      if (session && session.user) {
        try {
          const userId = await fetchUserIdByEmail(session.user.email);
          setUserID(userId);
        } catch (error) {
          console.error("Error fetching user ID:", error);
        }
      }
    };

    getUserID();
  }, [session]);

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
  const fetchSUser = async () => {
    if (userID) {
      try {
        const data = await fetchMostSimilarUsers(userID);
        setSuggestUser(data);
      } catch (error) {
        console.error("Error fetching suggested users:", error);
      }
    }
  };
  useEffect(() => {
    fetchSUser();
  }, [userID]);
  return (
    <div className="rightBarContainer">
      <div className="sugesstCard">
        <h1>Who to follow</h1>
        {suggestUser.map((user: any, index: any) => (
          <div key={index}>
            <UserCardSmall
              userID={user.similar_user}
              fetchSuggestUser={fetchSUser}
            />
          </div>
        ))}
        <NavLink to="/discover" className="seeMoreLink">
          See more
        </NavLink>
      </div>
      <div className="sugesstCard">
        <h1>Translation groups</h1>
        {suggestUser.map((user: any, index: any) => (
          <div key={index}>
            <UserCardSmall
              userID={user.similar_user}
              fetchSuggestUser={fetchSUser}
            />
          </div>
        ))}
        <NavLink to="/discover?is_group=true" className="seeMoreLink">
          See more
        </NavLink>
      </div>
      <div className="trend sugesstCard">
        <h1>Trends</h1>
        {comics.map((comic: any, index: any) => (
          <ComicCard
            key={index}
            cover={
              comic.relationships.find((r: any) => r.type === "cover_art")
                ?.attributes.fileName
            }
            title={comic.attributes.title.en}
            comictype={comic.type}
            maintag={comic.attributes.tags[0].attributes.name.en}
            id={comic.id}
          />
        ))}
        <NavLink to="latest" className="seeMoreLink">
          See more
        </NavLink>
      </div>
    </div>
  );
};

export default RightBar;
