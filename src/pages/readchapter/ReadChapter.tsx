import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ReadChapter.scss";
import { useParams } from "react-router-dom";

import SwiperCore from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

SwiperCore.use([Autoplay, Pagination, Navigation]);

interface Props { }

const MangaDetails: React.FC<Props> = () => {
    const { chapter_id } = useParams<{ chapter_id: string }>();
    const [data, setData] = useState<any>(null);
    const [imgStyle, setImgStyle] = useState<"style1" | "style2">("style1");
    const [imgStyleText, setImgStyleText] = useState<"Fit Width" | "Fit Height">("Fit Width");
    const swiperRef = useRef<SwiperCore | null>(null);

    const getData = async () => {
        try {
            const resp = await axios({
                method: "GET",
                url: `https://api.mangadex.org/at-home/server/${chapter_id}`,
            });
            console.log("Chapter data fetched successFity: ", resp.data.chapter);
            setData(resp.data);

            if (!resp.data) {
                throw new Error("Chapter not found.");
            }
        } catch (error) {
            console.error("Error fetching chapter:", error);
        }
    };

    useEffect(() => {
        getData();
    }, [chapter_id]);

    useEffect(() => {
        const handleKeydown = (e: KeyboardEvent) => {
            if (swiperRef.current) {
                if (e.key === "ArrowLeft") {
                    swiperRef.current.slidePrev();
                } else if (e.key === "ArrowRight") {
                    swiperRef.current.slideNext();
                }
            }
        };

        document.addEventListener("keydown", handleKeydown);

        return () => {
            document.removeEventListener("keydown", handleKeydown);
        };
    }, []);

    const toggleImgStyle = () => {
        setImgStyle((prevStyle) => (prevStyle === "style1" ? "style2" : "style1"));
        setImgStyleText((prevStyle) => (prevStyle === "Fit Width" ? "Fit Height" : "Fit Width"));
    };

    return (
        <div className="read-chapter-page">
            {!data ? (
                <div className="loading-wave">
                    <div className="loading-bar"></div>
                    <div className="loading-bar"></div>
                    <div className="loading-bar"></div>
                    <div className="loading-bar"></div>
                </div>
            ) : (
                <div className="chapter-swiper-container">
                    <Swiper
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;

                            const progressBar = document.querySelector(".chapter-swiper-pagination");

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
                        spaceBetween={0}
                        slidesPerView={1}
                        navigation={true}
                        autoplay={false}
                        pagination={{
                            el: ".chapter-swiper-pagination",
                            clickable: true,
                            type: "progressbar",
                        }}
                        style={{ height: "100%" }}
                    >
                        {data.chapter.data.map((chap: any) => (
                            <SwiperSlide key={chap.id} style={{ width: "100%" }}>
                                <div className={`swiper-slide-content ${imgStyle}`}>
                                    <img
                                        src={`${data.baseUrl}/data/${data.chapter.hash}/${chap}`}
                                        alt={`${chap}`}
                                        loading="lazy"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className="chapter-swiper-pagination"></div>
                    <button className="toggle-style-button" onClick={toggleImgStyle}>
                        Change To {imgStyleText}
                    </button>
                </div>
            )}
        </div>
    );
};

export default MangaDetails;
