import PostCard from '../../../components/socialComponents/Posts/PostCard/PostCard'
import PostSection from '../../../components/socialComponents/Posts/PostSection/PostSection'
import './feed.scss'
const Feed = () => {
    return (
        <div className="feedContainer">
            <div className="mainFeed">
                <div className="header">
                    <h2>Feed</h2>
                </div>
                <div className="newFeedSection">
                    <PostSection />
                </div>
                <div className="feedList">
                    {[0, 1, 2, 3, 4,1,1,1,1].map((imageCount, index) => ( // Thêm tham số index vào hàm map nếu cần thiết
                        <PostCard key={index} count={imageCount} isInDetailPage={false}/> // Sử dụng key để tránh cảnh báo mảng unique key trong React
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Feed