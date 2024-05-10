import React, { useState, useEffect } from 'react';
import SwiperCore from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import MangaCard from '../title/TitleCard2'; // Assuming your MangaCard component is in the same directory
import './MangaSwiper.scss';

SwiperCore.use([Navigation, Pagination, Autoplay]);

interface Props {
  mangas: any[]; // Assuming mangas is an array of manga objects
}

const MangaCardSwiper: React.FC<Props> = ({ mangas }) => {
  return (
    <div className='manga-swiper'>
        <Swiper
            spaceBetween={20}
            slidesPerView={3} // Adjust as needed
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
        >
        {mangas.map((manga, index) => (
            <SwiperSlide key={index}>
            <MangaCard manga={manga} />
            </SwiperSlide>
        ))}
        </Swiper>
    </div>
  );
};

export default MangaCardSwiper;
