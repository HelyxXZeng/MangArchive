import React, { useEffect, useRef } from "react";
// import Swiper from 'swiper';
import "swiper/swiper-bundle.css";

import "./BannerSwiper.scss";

import SwiperCore from "swiper";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Banner from "../banner/Banner";
// import { Swiper, SwiperSlide } from 'swiper/react';

SwiperCore.use([Autoplay, Pagination, Navigation]);

interface Props {
    banners: any;
    autoplay?: boolean;
    loop?: boolean;
    interval?: number;
}

const BannerSwiper: React.FC<Props> = ({
    banners,
    autoplay = true,
    loop = true,
    interval = 5000,
}) => {
    const swiperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (swiperRef.current) {
            const swiper = new SwiperCore(swiperRef.current, {
                autoplay: autoplay ? { delay: interval } : false,
                loop: loop,
                pagination: {
                    el: ".banner-swiper-pagination",
                    clickable: true,
                },
            });
            return () => {
                swiper.destroy();
            };
        }
    }, []);

    return (
        <div className="swiper-container" ref={swiperRef}>
            <div className="swiper-wrapper">
                {banners.map((banner: any, index: any) => (
                    <div className="swiper-slide" key={index}>
                        {/* <img src={banner.image} alt={`Banner ${index}`} /> */}
                        {/* <MangaCard key={index} manga={banner} /> */}
                        {/* <h3>{'NO.' + (index + 1)}</h3> */}
                        <Banner rank={index + 1} manga={banner} />
                    </div>
                ))}
            </div>
            <div className="banner-swiper-pagination"></div>
        </div>
    );

    // useEffect(() => {
    //     // Initialize Swiper when the component mounts
    //     const swiper = new SwiperCore('.swiper-container', {
    //       autoplay: autoplay ? { delay: interval } : false, // Autoplay if enabled
    //       loop: loop,
    //     });

    //     // Destroy Swiper instance when the component unmounts
    //     return () => {
    //       swiper.destroy();
    //     };
    //   }, [autoplay, loop]);

    //   return (
    //     <Swiper className="swiper-container">
    //       {banners.map((item: any, index: any) => (
    //         <SwiperSlide key={index}>
    //           <img src={item.image} alt={`Banner ${index}`} />
    //         </SwiperSlide>
    //       ))}
    //     </Swiper>
    //   );
};

export default BannerSwiper;
