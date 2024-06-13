import { useRef, useState, useEffect } from 'react';
import './postDetail.scss';
import PostCard from '../../../components/socialComponents/Posts/PostCard/PostCard';
import CommentBox from '../../../components/commentFunc/CommentFunc';
import PostImageViewer from '../../postImageViewer/PostImageViewer';
import CommentCard from '../../../components/commentCard/CommentCard';
import { useParams } from 'react-router-dom';
import { supabase } from '../../../utils/supabase';
import useCheckSession from '../../../hooks/session';

const PostDetail = () => {
  const { id: postId } = useParams<{ id: string }>();
  const [himage, setHImage] = useState<boolean>(true);
  const [placeholder, setPlaceholder] = useState<string>('Nhập bình luận...');
  const commentBoxRef = useRef(null);
  const [comments, setComments] = useState<any[]>([]);
  const [visibleReplies, setVisibleReplies] = useState<{ [key: number]: number }>({});
  const [replies, setReplies] = useState<{ [key: number]: any[] }>({});
  const [postImages, setPostImages] = useState<string[]>([]);
  const [commentOffset, setCommentOffset] = useState<number>(0);
  const [hasMoreComments, setHasMoreComments] = useState<boolean>(true);
  const commentsLimit = 10;

  useEffect(() => {
    const fetchPostImages = async () => {
      try {
        if (postId) {
          const { data, error } = await supabase.rpc('get_post_image', { post_id: parseInt(postId) });
          if (error) {
            console.error("Error fetching post images:", error);
          } else {
            const images = data.map((image: any) => JSON.parse(image).publicUrl);
            setPostImages(images);
            setHImage(images.length > 0);
          }
        }
      } catch (error) {
        console.error("Error fetching post images:", error);
      }
    };

    fetchPostImages();
  }, [postId]);

  const fetchComments = async (offset: number) => {
    try {
      if (postId) {
        const { data, error } = await supabase.rpc('get_comments_for_post', {
          this_limit: commentsLimit,
          this_offset: offset,
          this_post_id: parseInt(postId),
        });
        if (error) {
          console.error("Error fetching comments:", error);
        } else {
          setComments((prev) => offset === 0 ? data : [...prev, ...data]);
          setCommentOffset((prev) => offset + commentsLimit);
          setHasMoreComments(data.length === commentsLimit);

          // Fetch initial replies for each comment
          data.forEach((comment: any) => {
            fetchRepliesForComment(comment, 5); // Fetch 5 replies initially
          });
        }
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    setComments([]);
    setCommentOffset(0);
    setHasMoreComments(true);
    fetchComments(0);
  }, [postId]);

  const fetchRepliesForComment = async (commentId: number, limit: number) => {
    try {
      const { data, error } = await supabase.rpc('get_replies_for_comment', {
        this_limit: limit,
        this_offset: replies[commentId]?.length || 0,
        this_comment_id: commentId,
      });
      if (error) {
        console.error("Error fetching replies:", error);
      } else {
        setReplies((prevReplies) => {
          const existingReplies = prevReplies[commentId] || [];
          const newReplies = data.filter(reply => !existingReplies.some(existingReply => existingReply.id === reply.id));
          return {
            ...prevReplies,
            [commentId]: [...existingReplies, ...newReplies],
          };
        });
        setVisibleReplies((prev) => ({
          ...prev,
          [commentId]: (prev[commentId] || 0) + limit,
        }));
  
        // If initial fetch has less than 5 replies, fetch more until we have 5
        if (replies[commentId]?.length + data.length < 5 && data.length > 0) {
          fetchRepliesForComment(commentId, 5 - (replies[commentId]?.length + data.length));
        }
      }
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
  };
  

  const handleCommentSectionClick = () => {
    if (commentBoxRef.current) {
      commentBoxRef.current.focusTextarea();
    }
  };

  const handleReplyClick = (commentId: number, userId: number, username: string, isReplyToReply: boolean) => {
    setPlaceholder(`Trả lời bình luận của ${username}`);
    if (commentBoxRef.current) {
      commentBoxRef.current.focusTextarea();
      // Assuming commentBoxRef has a setReplyInfo method to pass reply info
      commentBoxRef.current.setReplyInfo({
        commentId,
        userId,
        username,
        isReplyToReply,
      });
    }
  };

  const handleSeeMoreReplies = (commentId: number) => {
    fetchRepliesForComment(commentId, 5);
  };

  const handleSeeMoreComments = () => {
    fetchComments(commentOffset);
  };

  return (
    <div className={`postDetailContainer${himage ? '' : 'Full'}`}>
      {himage && (
        <div className="imageDisplay">
          <PostImageViewer images={postImages} />
        </div>
      )}
      <div className="postContent">
        <div className="postNComment customScrollbar">
          <div className="post">
            <PostCard postId={postId} displayImage={false} onCommentSectionClick={handleCommentSectionClick} />
          </div>
          <div className="comments customScrollbar">
            {comments.map((comment) => (
              <div className="commentCard" key={comment}>
                <CommentCard
                  commentID={comment}
                  commentBoxRef={commentBoxRef}
                  onReplyClick={(userId, username) => handleReplyClick(comment, userId, username, false)}
                  replyCount={replies[comment]?.length | 0}
                />
                {replies[comment] && replies[comment].slice(0, visibleReplies[comment] || 1).map((reply) => (
                  <div className="commentCard replyCommentCard" key={reply}>
                    <CommentCard
                      commentID={reply}
                      commentBoxRef={commentBoxRef}
                      onReplyClick={(userId, username) => handleReplyClick(comment, userId, username, true)}
                    />
                  </div>
                ))}
                {replies[comment] && (visibleReplies[comment] || 1) < replies[comment].length && (
                  <div className="seemore commentCard" onClick={() => handleSeeMoreReplies(comment)}>
                    <img src="/icons/add-circle.svg" alt="See More Replies" />
                    <span className="seeMoreText">See more replies</span>
                  </div>
                )}
              </div>
            ))}
            {hasMoreComments && (
              <div className="seemore commentCard" onClick={handleSeeMoreComments}>
                <img src="/icons/add-circle.svg" alt="See More Comments" />
                <span className="seeMoreText">See more comments</span>
              </div>
            )}
          </div>
        </div>
        <div className="commentEditable">
        <CommentBox ref={commentBoxRef} placeholder={placeholder} postId={postId} refreshList={() => fetchComments(0)} />
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
