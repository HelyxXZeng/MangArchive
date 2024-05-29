import React, { useState, useEffect, useRef } from "react";
import "./postImageViewer.scss";
import { useParams, useNavigate } from "react-router-dom";

import SwiperCore from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

SwiperCore.use([Autoplay, Pagination, Navigation]);

interface Props { }

const PostImageViewer: React.FC<Props> = () => {
    const { post_id } = useParams<{ post_id: string }>();
    const [data, setData] = useState<any>(null);
    const [imgStyle, setImgStyle] = useState<"style1" | "style2">("style1");
    const swiperRef = useRef<SwiperCore | null>(null);
    const navigate = useNavigate(); // Use history for navigation

    const getData = async () => {
        try {
            // const resp = await axios({
            //     method: "GET",
            //     url: `https://api.mangadex.org/at-home/server/${post_id}`,
            // });
            // console.log("post data fetched successfully: ", resp.data.post);
            // setData(resp.data);

            // if (!resp.data) {
            //     throw new Error("post not found.");
            // }
        } catch (error) {
            console.error("Error fetching post:", error);
        }
    };

    useEffect(() => {
        getData();
    }, [post_id]);
    // setData()
    useEffect(() => {
        const handleKeydown = (e: KeyboardEvent) => {
            if (swiperRef.current) {
                if (e.key === "ArrowLeft") {
                    swiperRef.current.slidePrev();
                } else if (e.key === "ArrowRight") {
                    if (swiperRef.current.isEnd) {
                        navigate(-1); // Go back to the previous URL
                    } else {
                        swiperRef.current.slideNext();
                    }
                }
            }
        };

        document.addEventListener("keydown", handleKeydown);

        return () => {
            document.removeEventListener("keydown", handleKeydown);
        };
    }, [history]);

    const toggleImgStyle = () => {
        setImgStyle((prevStyle) => (prevStyle === "style1" ? "style2" : "style1"));
    };

    return (
        <div className="read-post-page">
            {!data ? (
                <div className="loading-wave">
                    <div className="loading-bar"></div>
                    <div className="loading-bar"></div>
                    <div className="loading-bar"></div>
                    <div className="loading-bar"></div>
                </div>
            ) : (
                <div className="post-swiper-container">
                    <Swiper
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;

                            const progressBar = document.querySelector(".post-swiper-pagination");

                            if (progressBar) {
                                progressBar.addEventListener("click", (e) => {
                                    const event = e as MouseEvent;
                                    const progressBarElement = progressBar as HTMLElement;
                                    const rect = progressBarElement.getBoundingClientRect();
                                    const clickPosition = event.clientX - rect.left;
                                    const clickRatio = clickPosition / rect.width;
                                    const slideTo = Math.floor(clickRatio * swiper.slides.length);
                                    swiper.slideTo(slideTo);
                                });
                            }
                        }}
                        onSlideChange={(swiper) => {
                            if (swiper.isEnd) {
                                document.body.classList.add('swiper-at-end');
                            } else {
                                document.body.classList.remove('swiper-at-end');
                            }
                        }}
                        spaceBetween={0}
                        slidesPerView={1}
                        navigation={true}
                        autoplay={false}
                        pagination={{
                            el: ".post-swiper-pagination",
                            clickable: true,
                            type: "progressbar",
                        }}
                        style={{ height: "100%" }}
                    >
                        {data.post.data.map((chap: any) => (
                            <SwiperSlide key={chap.id} style={{ width: "100%" }}>
                                <div className={`swiper-slide-content ${imgStyle}`}>
                                    <img
                                        src={`${data.baseUrl}`}
                                        alt={`${chap}`}
                                        loading="lazy"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className="post-swiper-pagination"></div>
                    <button className="toggle-style-button" onClick={toggleImgStyle}>
                        Toggle Image Style
                    </button>
                </div>
            )}
        </div>
    );
};

export default PostImageViewer;
