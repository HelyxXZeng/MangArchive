import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ReadChapter.scss";
import { useParams, useNavigate } from "react-router-dom";
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import Modal from "../messagemodal/Modal";

import SwiperCore from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

SwiperCore.use([Autoplay, Pagination, Navigation]);

interface Props { }

const MangaDetails: React.FC<Props> = () => {
    const { chapter_id } = useParams<{ chapter_id: string }>();
    const [data, setData] = useState<any>(null);
    const [imgStyle, setImgStyle] = useState<"style1" | "style2">("style1");
    const [imgStyleText, setImgStyleText] = useState<"Full Width" | "Full Height">("Full Width");
    const [isDownloading, setIsDownloading] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const swiperRef = useRef<SwiperCore | null>(null);
    const navigate = useNavigate(); // Use history for navigation

    const getData = async () => {
        try {
            const resp = await axios({
                method: "GET",
                url: `https://api.mangadex.org/at-home/server/${chapter_id}`,
            });
            console.log("Chapter data fetched successfully: ", resp.data.chapter);
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
    }, [navigate]);

    const toggleImgStyle = () => {
        setImgStyle((prevStyle) => (prevStyle === "style1" ? "style2" : "style1"));
        setImgStyleText((prevStyle) => (prevStyle === "Full Width" ? "Full Height" : "Full Width"));
    };

    const downloadChapter = async () => {
        setIsDownloading(true);
        setModalMessage("Downloading chapter, please wait...");

        const zip = new JSZip();
        const folder = zip.folder(`MangArchive/${chapter_id}`);

        if (data && data.chapter && data.chapter.data) {
            try {
                for (const page of data.chapter.data) {
                    const response = await axios({
                        method: 'GET',
                        url: `${data.baseUrl}/data/${data.chapter.hash}/${page}`,
                        responseType: 'arraybuffer'
                    });

                    if (folder) folder.file(page, response.data);
                }

                const content = await zip.generateAsync({ type: 'blob' });
                saveAs(content, `MangArchive_${chapter_id}.zip`);
                setModalMessage("Download complete!");
            } catch (error) {
                setModalMessage("An error occurred during download.");
            } finally {
                setIsDownloading(false);
            }
        } else {
            setModalMessage("No data available to download.");
            setIsDownloading(false);
        }
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
                        Change to {imgStyleText}
                    </button>
                    <button className="download-chapter-button" onClick={downloadChapter}>
                        Download chapter
                    </button>
                    <div className="chapter-info">
                        Chapter:
                    </div>
                </div>
            )}
            {isDownloading && <Modal message={modalMessage} onClose={() => setIsDownloading(false)} />}
        </div>
    );
};

export default MangaDetails;
