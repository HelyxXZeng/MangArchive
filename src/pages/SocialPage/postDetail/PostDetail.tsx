import { useState } from 'react'
import './postDetail.scss'
import PostCard from '../../../components/socialComponents/Posts/PostCard/PostCard';
import CommentBox from '../../../components/commentFunc/CommentFunc';
import PostImageViewer from '../../postImageViewer/PostImageViewer';
import CommentCard from '../../../components/commentCard/CommentCard';

const PostDetail = () => {
  const [himage, setHImage] = useState<boolean>(true);
  return (
    <div className={`postDetailContainer${himage ? '' : 'Full'}`}>
      {himage && (
        <div className="imageDisplay">
          <PostImageViewer />
        </div>
      )}
      <div className="postContent">
        <div className="postNComment customScrollbar">
          <div className="post">
            <PostCard count={0} />
          </div>
          <div className="comments customScrollbar">
            {[1, 1, 1, 1, 1, 1, 1].map((_, index: number) => (
              <CommentCard key={index} className="commentCard"/>
            ))}
          </div>
        </div>
        <div className="commentEditable">
          <CommentBox />
        </div>
      </div>
    </div>
  )
}

export default PostDetail