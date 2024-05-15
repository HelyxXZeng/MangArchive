import PostCard from '../../../../components/socialComponents/Posts/PostCard/PostCard'
import PostSection from '../../../../components/socialComponents/Posts/PostSection/PostSection'
import './post.scss'
const Post = () => {
  return (
    <div className="postContainer">
      <div className="postsection">
        <PostSection/>
      </div>
      <div className="postlist">
        {[1].map((_, index) => ( // Thêm tham số index vào hàm map nếu cần thiết
          <PostCard key={index}/> // Sử dụng key để tránh cảnh báo mảng unique key trong React
        ))}
      </div>
    </div>
  )
}

export default Post