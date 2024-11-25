import { useRef, useState, useEffect } from "react";
import "./postDetail.scss";
import PostCard from "../../../components/socialComponents/Posts/PostCard/PostCard";
import CommentBox, {
  CommentBoxRef,
} from "../../../components/commentFunc/CommentFunc";
import PostImageViewer from "../../../components/socialComponents/Posts/postImageViewer/PostImageViewer";
import CommentCard from "../../../components/commentCard/CommentCard";
import { useParams } from "react-router-dom";
import {
  fetchComments,
  fetchPostImages,
  fetchRepliesForComment,
} from "../../../api/postAPI";
import { useTranslation } from "react-i18next";

const PostDetail = () => {
  const { id: postId } = useParams<{ id: string }>();
  const [himage, setHImage] = useState<boolean>(true);
  const [placeholder, setPlaceholder] = useState<string>("Nhập bình luận...");
  const commentBoxRef = useRef<CommentBoxRef>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [visibleReplies, setVisibleReplies] = useState<{
    [key: number]: number;
  }>({});
  const [replies, setReplies] = useState<{ [key: number]: any[] }>({});
  const [postImages, setPostImages] = useState<string[]>([]);
  const [commentOffset, setCommentOffset] = useState<number>(0);
  const [hasMoreComments, setHasMoreComments] = useState<boolean>(true);
  const commentsLimit = 5;
  const { t } = useTranslation("", { keyPrefix: "utils-reply" });
  const fetchPostImage = async () => {
    try {
      if (postId) {
        const images = await fetchPostImages(Number(postId));
        setPostImages(images);
        setHImage(images.length > 0);
      }
    } catch (error) {
      console.error("Error fetching post images:", error);
    }
  };

  const fetchCommentList = async (offset: number) => {
    try {
      if (postId) {
        const data = await fetchComments(Number(postId), offset, commentsLimit);
        setComments((prev) => (offset === 0 ? data : [...prev, ...data]));
        setCommentOffset(() => offset + commentsLimit);
        setHasMoreComments(data.length === commentsLimit);

        // Fetch initial replies for each comment
        data.forEach((comment: any) => {
          fetchRepliesFComments(comment, 1); // Fetch 5 replies initially
        });
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const fetchRepliesFComments = async (commentId: number, limit: number) => {
    try {
      const currentRepliesCount = replies[commentId]?.length || 0;

      // Lấy thêm reply nếu cần
      const data = await fetchRepliesForComment(
        commentId,
        currentRepliesCount,
        limit
      );

      // Cập nhật state replies mà không thay đổi toàn bộ
      setReplies((prevReplies) => {
        const existingReplies = prevReplies[commentId] || [];
        const newReplies = data.filter(
          (reply: any) =>
            !existingReplies.some(
              (existingReply) => existingReply.id === reply.id
            )
        );
        return {
          ...prevReplies,
          [commentId]: [...existingReplies, ...newReplies],
        };
      });

      // Cập nhật số lượng visibleReplies
      setVisibleReplies((prev) => ({
        ...prev,
        [commentId]: (prev[commentId] || 0) + limit,
      }));

      // Nếu chưa đủ replies, gọi thêm
      const totalReplies = (replies[commentId]?.length || 0) + data.length;
      if (totalReplies < 5 && data.length > 0) {
        const remainingReplies = 5 - totalReplies;
        fetchRepliesFComments(commentId, remainingReplies); // Lấy thêm nếu chưa đủ 5
      }
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
  };

  useEffect(() => {
    setComments([]);
    setCommentOffset(0);
    setHasMoreComments(true);
    fetchPostImage();
    fetchCommentList(0);
  }, [postId]);

  const handleCommentSectionClick = () => {
    if (commentBoxRef?.current) {
      commentBoxRef?.current?.focusTextarea();
    }
  };

  const handleReplyClick = (
    commentId: number,
    userId: number,
    username: string,
    isReplyToReply: boolean
  ) => {
    setPlaceholder(`${t("reply-user")}${username}`);
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
    fetchRepliesFComments(commentId, 5);
  };

  const handleSeeMoreComments = () => {
    fetchCommentList(commentOffset);
  };

  return (
    <div className={`postDetailContainer${himage ? "" : "Full"}`}>
      {himage && (
        <div className="imageDisplay">
          <PostImageViewer images={postImages} />
        </div>
      )}
      <div className="postContent">
        <div className="postNComment customScrollbar">
          <div className="post">
            <PostCard
              postId={postId}
              displayImage={false}
              onCommentSectionClick={handleCommentSectionClick}
            />
          </div>
          <div className="comments customScrollbar">
            {comments.map((comment) => (
              <div className="commentCard" key={comment}>
                <CommentCard
                  commentID={comment}
                  commentBoxRef={commentBoxRef}
                  onReplyClick={(userId, username) =>
                    handleReplyClick(comment, userId, username, false)
                  }
                  replyCount={replies[comment]?.length | 0}
                />
                {replies[comment] &&
                  replies[comment]
                    .slice(0, visibleReplies[comment] || 1)
                    .map((reply) => (
                      <div className="commentCard replyCommentCard" key={reply}>
                        <CommentCard
                          commentID={reply}
                          commentBoxRef={commentBoxRef}
                          onReplyClick={(userId, username) =>
                            handleReplyClick(comment, userId, username, true)
                          }
                        />
                      </div>
                    ))}
                {replies[comment] &&
                  (visibleReplies[comment] || 1) < replies[comment].length && (
                    <div
                      className="seemore commentCard"
                      onClick={() => handleSeeMoreReplies(comment)}
                    >
                      <img src="/icons/add-circle.svg" alt="See More Replies" />
                      <span className="seeMoreText">See more replies</span>
                    </div>
                  )}
              </div>
            ))}
            {hasMoreComments && (
              <div
                className="seemore commentCard"
                onClick={handleSeeMoreComments}
              >
                <img src="/icons/add-circle.svg" alt="See More Comments" />
                <span className="seeMoreText">See more comments</span>
              </div>
            )}
          </div>
        </div>
        <div className="commentEditable">
          <CommentBox
            ref={commentBoxRef}
            placeholder={placeholder}
            postId={postId}
            refreshList={() => fetchCommentList(0)}
          />
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
