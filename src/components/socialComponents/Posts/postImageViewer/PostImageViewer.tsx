import React, { useEffect, useRef } from "react";
import "./postImageViewer.scss";
import { useNavigate } from "react-router-dom";

import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

interface Props {
  images: string[];
}

const PostImageViewer: React.FC<Props> = ({ images }) => {
  const swiperRef = useRef<SwiperCore | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (swiperRef.current) {
        if (e.key === "ArrowLeft") {
          swiperRef.current.slidePrev();
        } else if (e.key === "ArrowRight") {
          if (swiperRef.current.isEnd) {
            navigate(-1);
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

  return (
    <div className="postImageContainer">
      {!images.length ? (
        <div className="loading-wave">
          <div className="loading-bar"></div>
          <div className="loading-bar"></div>
          <div className="loading-bar"></div>
          <div className="loading-bar"></div>
        </div>
      ) : (
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={10}
          slidesPerView={1}
          slidesPerGroup={1}
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          className="previewImageContainer"
          loop={true}
          navigation={images.length > 1}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} className="previewImage">
              <div style={{ position: "relative" }} className="previewIMG">
                <img
                  className="image"
                  src={image}
                  alt={`Slide ${index}`}
                  loading="lazy"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default PostImageViewer;
