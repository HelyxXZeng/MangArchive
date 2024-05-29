import { useState } from 'react'
import './postDetail.scss'
import PostCard from '../../../components/socialComponents/Posts/PostCard/PostCard';
import CommentBox from '../../../components/commentFunc/CommentFunc';
import PostImageViewer from '../../postImageViewer/PostImageViewer';

const PostDetail = () => {
    const [himage,setHImage] =useState<boolean>(false);
  return (
    <div className="postDetailContainer">
        { himage && (
        <div className="imageDisplay">
          <PostImageViewer/>
        </div>
        )}
        <div className={`postContent${himage ? '' : 'Full'}`}>
          <div className="post">
            <PostCard count={0}/>
          </div>
          <div className="comments">

          </div>
          <div className="commentEditable">
            <CommentBox
              className="text"/>
          </div>
        </div>
    </div>
  )
}

export default PostDetail