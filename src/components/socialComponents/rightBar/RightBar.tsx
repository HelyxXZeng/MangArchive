import { NavLink } from "react-router-dom";
import UserCardSmall from "../userCardSmall/UserCardSmall";
import "./rightBar.scss";
import ComicCard from "../comicCardSmall/ComicCard";
import { suggestManga } from "../../../utils/SuggestManga"
import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabase";
import useCheckSession from "../../../hooks/session";
const RightBar = () => {
  const [comics, setComics] = useState([]);
  const [suggestUser, setSuggestuser] = useState<any>([]);
  const session = useCheckSession();
  const [userID, setUserID] = useState<any>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      if (session !== null) {
        try {
          const { user } = session;
          if (user) {
            let { data, error } = await supabase.rpc("get_user_id_by_email", {
              p_email: session.user.email,
            });
            if (error) console.error(error);
            else {
              setUserID(data);
              // console.log("User ID: ", data);
            }
          }
        } catch (error) {
          console.error("Error fetching username:", error);
        }
      }
    };

    fetchUserId();
  }, [session,userID,]);

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
    try {
      const { data, error } = await supabase
        .rpc('get_most_similar_users', {
          this_limit: 3,
          user_id: userID
        })
      if (error) console.log(error)
      else {
        setSuggestuser(data)
        // console.log(data) 
      }
    } catch (error) {
      console.error("Error fetching suggest User:", error)
    }
  };
  useEffect(() => {
    fetchSUser();
  }, [session,userID])
  return (
    <div className="rightBarContainer">
      <div className="sugesstCard">
        <h1>Who to follow</h1>
        {suggestUser.map((user: any, index: any) => (
          <div key={index}>
            <UserCardSmall userID={user.similar_user} fetchSuggestUser={fetchSUser} />
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
            <UserCardSmall userID={user.similar_user} fetchSuggestUser={fetchSUser} />
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
            cover={comic.relationships.find((r: any) => r.type === "cover_art")?.attributes.fileName}
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
