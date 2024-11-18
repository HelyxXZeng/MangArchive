import React from "react";
import SwiperCore from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import MangaCard from "../title/TitleCard2"; // Assuming your MangaCard component is in the same directory
import "./MangaSwiper.scss";

SwiperCore.use([Navigation, Pagination, Autoplay]);
// SwiperCore.use([Navigation]);

interface Props {
  mangas: any[]; // Assuming mangas is an array of manga objects
}

const MangaCardSwiper: React.FC<Props> = ({ mangas }) => {
  return (
    <div className="manga-swiper">
      <Swiper
        // ref={swiperRef}
        spaceBetween={0} // Adjust as per your requirement
        slidesPerView={"auto"}
        navigation
        autoplay={{ delay: 3000 }}
        // loop={true}
      >
        {mangas.map((manga: any) => (
          <SwiperSlide key={manga.id} style={{ width: "fit-content" }}>
            <div className="swiper-slide-content">
              {" "}
              {/* Center the MangaCard horizontally */}
              <MangaCard manga={manga} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MangaCardSwiper;
