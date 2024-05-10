import React, { useState, useEffect } from 'react';
import './MangaBanner.scss';
import Tag from '../tag/Tag';

import Image from '../image/Image';

interface BannerProps {
    rank: any
    manga: any,
}

const Banner: React.FC<BannerProps> = ({ manga, rank }) => {
    const [cover, setCover] = useState('');
    const [author, setAuthor] = useState('');

    const getCover = async() => {
        // manga.relationships.forEach((relate: any) => {
        //     if (relate.type === 'cover_art') {
        //         setCover(relate.attributes?.fileName);
        //     }
        // });
        setCover(manga.relationships.find((r: any) => r.type === "cover_art")?.attributes.fileName);
        setAuthor(manga.relationships.find((r: any) => r.type === "author")?.attributes.name);
    }

    useEffect(() => {
        getCover();
      }, []);

  return (
    <div>
        <div className='profile-manga-image'>
            {/* <img src={'https://uploads.mangadex.org/covers/' + manga.id + '/' + cover + '.512.jpg'} alt={manga.attributes.title.en} /> */}
            <Image className='cover-background' src={'https://uploads.mangadex.org/covers/' + manga.id + '/' + cover + '.512.jpg'} alt={manga.attributes.title.en} ratio="16/9" />
        </div>
        <div className="manga-banner-container">
            <div className="manga-banner-image">
                {/* <img src={'https://uploads.mangadex.org/covers/' + manga.id + '/' + cover + '.512.jpg'} alt={manga.attributes.title.en} /> */}
                <Image src={'https://uploads.mangadex.org/covers/' + manga.id + '/' + cover + '.512.jpg'} alt={manga.attributes.title.en} ratio="4/6" />
            </div>
            <div className="manga-banner-info">
                <h5>{author}</h5>
                <div className="manga-banner-tags">
                    {manga.attributes.tags.map((tag: any) => (
                        <Tag tag={tag}/>
                    ))}
                </div>
                {/* <p>{manga.attributes.description.en}</p> */}
                <h2>{((manga.attributes.title.en) || (manga.attributes.title.ja)) + ' - NO.' + rank}</h2>
                {/* Add more info sections here */}
            </div>
        </div>
    </div>
  );
};

export default Banner;