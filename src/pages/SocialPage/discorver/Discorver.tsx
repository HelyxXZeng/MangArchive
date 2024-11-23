import "./discover.scss";
import UserCardLarge from "../../../components/socialComponents/userCardLarge/UserCardLarge";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import useCheckSession from "../../../hooks/session";
import { fetchUserIdByEmail } from "../../../api/userAPI";
import {
  fetchGroupSuggestList,
  fetchUserSuggestList,
} from "../../../api/scocialAPI";
import { useTranslation } from "react-i18next";

const NotFound: React.FC = () => (
  <div className="notFound">
    <h2>404 - Page Not Found</h2>
    <p>The page you are looking for does not exist.</p>
    <Link to="/discover">Go to Discover</Link>
  </div>
);

const Discover: React.FC = () => {
  const navigate = useNavigate();
  const [userList, setUserList] = useState<any[]>([]);
  const [groupList, setGroupList] = useState<any[]>([]);
  const handleBack = () => navigate(-1);
  const routes = ["/discover", "/discover?is_group=true"];
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const session = useCheckSession();
  const [userID, setUserID] = useState<any>(null);
  const { t } = useTranslation("", { keyPrefix: "discover" });
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

  function useRouteMatch(patterns: readonly string[]) {
    const { pathname, search } = useLocation();
    const fullPath = `${pathname}${search}`;
    for (let i = 0; i < patterns.length; i += 1) {
      const pattern = patterns[i];
      if (pattern === fullPath) {
        return { pattern: { path: pattern } };
      }
    }
    return null;
  }
  const routeMatch = useRouteMatch(routes);
  const currentTab = routeMatch?.pattern?.path;

  if (!currentTab) {
    return <NotFound />;
  }

  const getSuggestList = (page: number) => {
    if (currentTab === "/discover") {
      getUserSuggestList(page);
    } else if (currentTab === "/discover?is_group=true") {
      getGroupSuggestList(page);
    }
  };

  useEffect(() => {
    if (userID) {
      setUserList([]);
      setGroupList([]);
      setPage(1);
      // setHasMore(true);
      getSuggestList(1);
    }
  }, [userID, currentTab]);

  const getUserSuggestList = async (page: number) => {
    try {
      const data = await fetchUserSuggestList(userID, page);
      setUserList((prevList) => (page === 1 ? data : [...prevList, ...data]));
      setHasMore(data.length === 10);
    } catch (error) {
      console.error("Error fetching user suggestions:", error);
    }
  };

  const getGroupSuggestList = async (page: number) => {
    try {
      const data = await fetchGroupSuggestList(userID, page);
      setGroupList((prevList) => (page === 1 ? data : [...prevList, ...data]));
      setHasMore(data.length === 10);
    } catch (error) {
      console.error("Error fetching group suggestions:", error);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    getSuggestList(nextPage);
  };

  return (
    <div className="discoverFrame">
      <section className="headernav">
        <button className="backbutton" onClick={handleBack} title={t("back")}>
          <img src="/icons/arrow-left.svg" alt={t("back")} />
        </button>
        <div className="headerInfo">
          <h2>{t("Discover")}</h2>
        </div>
      </section>
      <section className="mainContent">
        <nav className="navigationBar">
          <Tabs
            value={currentTab}
            className="tabstest"
            aria-label={t("navTabsExample")}
            role="navigation"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                color: "#E7E9EA",
                fontWeight: 700,
                fontFamily: '"Lato", sans-serif',
                padding: "0 16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minWidth: 160,
                maxWidth: 480,
                width: "auto",
                flex: 1,
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#4296cf",
              },
              "& .Mui-selected": {
                color: "#4296cf !important",
              },
            }}
          >
            <Tab
              label={t("suggestFollowing")}
              to="/discover"
              value="/discover"
              component={Link}
            />
            <Tab
              label={t("translationGroupForYou")}
              to="/discover?is_group=true"
              value="/discover?is_group=true"
              component={Link}
            />
          </Tabs>
        </nav>
        {currentTab === "/discover"
          ? userList.map((user: any) => (
              <UserCardLarge
                key={user.similar_user}
                userID={user.similar_user}
                fetchSuggestUser={() => getSuggestList(1)}
              />
            ))
          : groupList.map((group: any) => (
              <UserCardLarge
                key={group.similar_user}
                userID={group.similar_user}
                fetchSuggestUser={() => getSuggestList(1)}
              />
            ))}
        {hasMore ? (
          <div className="loadMore" onClick={handleLoadMore}>
            {t("loadMore")}
          </div>
        ) : (
          <div className="noMoreUsers">{t("noMoreUsers")}</div>
        )}
      </section>
    </div>
  );
};

export default Discover;
