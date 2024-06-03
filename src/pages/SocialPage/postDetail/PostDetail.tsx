import { useRef, useState, useEffect } from 'react'
import './postDetail.scss'
import PostCard from '../../../components/socialComponents/Posts/PostCard/PostCard';
import CommentBox from '../../../components/commentFunc/CommentFunc';
import PostImageViewer from '../../postImageViewer/PostImageViewer';
import CommentCard from '../../../components/commentCard/CommentCard';

// Dữ liệu mẫu cho các bình luận và phản hồi
const sampleComments = [
  {
    id: 1,
    user: 'User1',
    content: 'This is a comment with no replies.',
    replies: []
  },
  {
    id: 2,
    user: 'User2',
    content: 'This is a comment with one reply.',
    replies: [
      { id: 1, user: 'User3', content: 'This is a reply.' }
    ]
  },
  {
    id: 3,
    user: 'User3',
    content: 'This is a comment with five replies.',
    replies: [
      { id: 1, user: 'User4', content: 'This is reply 1.' },
      { id: 2, user: 'User5', content: 'This is reply 2.' },
      { id: 3, user: 'User6', content: 'This is reply 3.' },
      { id: 4, user: 'User7', content: 'This is reply 4.' },
      { id: 5, user: 'User8', content: 'This is reply 5.' }
    ]
  },
  {
    id: 4,
    user: 'User4',
    content: 'This is a comment with eight replies.',
    replies: [
      { id: 1, user: 'User5', content: 'This is reply 1.' },
      { id: 2, user: 'User6', content: 'This is reply 2.' },
      { id: 3, user: 'User7', content: 'This is reply 3.' },
      { id: 4, user: 'User8', content: 'This is reply 4.' },
      { id: 5, user: 'User9', content: 'This is reply 5.' },
      { id: 6, user: 'User10', content: 'This is reply 6.' },
      { id: 7, user: 'User11', content: 'This is reply 7.' },
      { id: 8, user: 'User12', content: 'This is reply 8.' }
    ]
  }
];

const PostDetail = () => {
  const [himage, setHImage] = useState<boolean>(true);
  const [placeholder, setPlaceholder] = useState<string>('Nhập bình luận...');
  const commentBoxRef = useRef(null);

  const [comments, setComments] = useState(sampleComments);
  const [visibleReplies, setVisibleReplies] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    // Thay thế bằng API call để lấy dữ liệu bình luận từ Supabase
    // fetchCommentsFromAPI();
  }, []);

  const handleCommentSectionClick = () => {
    if (commentBoxRef.current) {
      commentBoxRef.current.focusTextarea();
    }
  };

  const handleReplyClick = (name: string) => {
    setPlaceholder(`Trả lời bình luận của ${name}`);
    if (commentBoxRef.current) {
      commentBoxRef.current.focusTextarea();
    }
  };

  const handleSeeMoreReplies = (commentIndex: number) => {
    setVisibleReplies((prev) => ({
      ...prev,
      [commentIndex]: (prev[commentIndex] || 1) + 5,
    }));
  };

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
            <PostCard count={0} isInDetailPage={true} onCommentSectionClick={handleCommentSectionClick} />
          </div>
          <div className="comments customScrollbar">
            {comments.map((comment, index) => (
              <div className="commentCard" key={comment.id}>
                <CommentCard commentBoxRef={commentBoxRef} onReplyClick={handleReplyClick} />
                {comment.replies.slice(0, visibleReplies[index] || 1).map((reply) => (
                  <div className="commentCard replyCommentCard" key={reply.id}>
                    <CommentCard commentBoxRef={commentBoxRef} onReplyClick={handleReplyClick} />
                  </div>
                ))}
                {(visibleReplies[index] || 1) < comment.replies.length && (
                  <div className="seemore commentCard" onClick={() => handleSeeMoreReplies(index)}>
                    <img
                    src="/icons/add-circle.svg"
                    alt="See More Replies"
                  />
                  <span className="seeMoreText">See more replies</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="commentEditable">
          <CommentBox ref={commentBoxRef} placeholder={placeholder} />
        </div>
      </div>
    </div>
  )
}

export default PostDetail;
