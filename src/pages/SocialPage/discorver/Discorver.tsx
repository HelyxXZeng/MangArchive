
import './discover.scss'
import userList, { User } from '../../../../public/User';
import UserCardLarge from '../../../components/socialComponents/userCardLarge/UserCardLarge';
import { Link, matchPath, useLocation, useNavigate } from 'react-router-dom';
import { Tab, Tabs } from '@mui/material';

const NotFound: React.FC = () => (
    <div className="notFound">
        <h2>404 - Page Not Found</h2>
        <p>The page you are looking for does not exist.</p>
        <Link to="/discover">Go to Discover</Link>
    </div>
);
const Discorver = () => {
    const navigate = useNavigate();
    // const [userList, setUserList] = useState<any>([]);
    const handleBack = () => navigate(-1);
    const routes = ["/discover", "/discover?is_group=true"]
    function useRouteMatch(patterns: readonly string[]) {
        const { pathname, search } = useLocation();
        const fullPath = `${pathname}${search}`;
        for (let i = 0; i < patterns.length; i += 1) {
            const pattern = patterns[i];
            // Check for an exact match
            if (pattern === fullPath) {
                return { pattern: { path: pattern } };
            }
        }
        return null;
    }
    const routeMatch = useRouteMatch(routes);
    const currentTab = routeMatch?.pattern?.path;
    // console.log(currentTab)

    if (!currentTab) {
        // If the current path does not match any of the routes, render NotFound component
        return <NotFound />;
    }
    /* //viết trước
    useEffect(() => {
        if (currentTab === "/discover") {
            setPage(1);
            getUserSuggestList(1);
        } else if (currentTab === "/discover?is_group=true") {
            setPage(1);
            getGroupSuggestList(1);
        }
    }, [currentTab]);

    // Function to fetch user suggestions
    const getUserSuggestList = async (page: number) => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*') // Modify based on your table and columns
                .range((page - 1) * 20, page * 20 - 1); // Limit to 20 users per page

            if (error) {
                console.error('Error fetching user suggestions:', error);
            } else {
                setUsers(prevUsers => (page === 1 ? data : [...prevUsers, ...data]));
                setHasMore(data.length === 20);
            }
        } catch (error) {
            console.error('Error fetching user suggestions:', error);
        }
    };

    // Function to fetch group suggestions
    const getGroupSuggestList = async (page: number) => {
        try {
            const { data, error } = await supabase
                .from('groups')
                .select('*') // Modify based on your table and columns
                .range((page - 1) * 20, page * 20 - 1); // Limit to 20 users per page

            if (error) {
                console.error('Error fetching group suggestions:', error);
            } else {
                setUsers(prevUsers => (page === 1 ? data : [...prevUsers, ...data]));
                setHasMore(data.length === 20);
            }
        } catch (error) {
            console.error('Error fetching group suggestions:', error);
        }
    };

    const lastUserElementRef = useCallback(
        (node) => {
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prevPage) => prevPage + 1);
                    if (currentTab === "/discover") {
                        getUserSuggestList(page + 1);
                    } else if (currentTab === "/discover?is_group=true") {
                        getGroupSuggestList(page + 1);
                    }
                }
            });
            if (node) observer.current.observe(node);
        },
        [hasMore, currentTab, page]
    );
    */
    return (
        <div className="discoverFrame">
            <section className="headernav">
                <button className="backbutton" onClick={handleBack} title="back">
                    <img src="/icons/arrow-left.svg" alt="" />
                </button>
                <div className="headerInfo">
                    <h2>Discover</h2>
                </div>
            </section>
            <section className="mainContent">
                <nav className="navigationBar">
                    <Tabs
                        value={currentTab}
                        className="tabstest"
                        aria-label="nav tabs example"
                        role="navigation"
                        scrollButtons="auto"
                        // onChange={handleChange}
                        sx={{
                            '& .MuiTab-root': {
                                color: "#E7E9EA",
                                fontWeight: 700,
                                fontFamily: '"Lato", sans-serif',
                                padding: '0 16px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                minWidth: 160,
                                maxWidth: 480,
                                width: 'auto',
                                flex: 1,
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: "#4296cf",
                            },
                            '& .Mui-selected': {
                                color: "#4296cf !important",
                            }
                        }}
                    >
                        <Tab label="Suggest following" to={"/discover"} value={"/discover"} component={Link} />
                        <Tab label="Translation group for you" to={"/discover?is_group=true"} value={"/discover?is_group=true"} component={Link} />
                    </Tabs>
                </nav>
                {userList.map((user: User, index: number) => (
                    <UserCardLarge
                        key={index}
                        name={user.Name}
                        idName={user.ID}
                        followedState={true} // You can set the followed state as per your requirement
                        description={user.description}
                        level={user.level}
                    />
                ))}
            </section>
        </div>
    )
}

export default Discorver