import React, { useState, useEffect } from 'react';
import './Banner.scss';

import Image from '../image/Image';
import Tag from '../tag/Tag';
import { NavLink } from 'react-router-dom';

interface BannerProps {
    rank: any
    manga: any,
}

const Banner: React.FC<BannerProps> = ({ manga, rank }) => {
    const [cover, setCover] = useState('');
    const [author, setAuthor] = useState('');
    const [artist, setArtist] = useState('');

    const getCover = async () => {
        // manga.relationships.forEach((relate: any) => {
        //     if (relate.type === 'cover_art') {
        //         setCover(relate.attributes?.fileName);
        //     }
        // });
        setCover(manga.relationships.find((r: any) => r.type === "cover_art")?.attributes.fileName);
        setAuthor(manga.relationships.find((r: any) => r.type === "author")?.attributes.name);
        setArtist(manga.relationships.find((r: any) => r.type === "artist")?.attributes.name);
    }

    useEffect(() => {
        getCover();
    }, []);

    return (
        <div className="banner-container">
            {/* <div className="background-img" style={{backgroundImage: `url(https://uploads.mangadex.org/covers/${manga.id}/${cover}.512.jpg)`}}/> */}
            <NavLink to={`/manga/${manga.id}`} style={{ textDecoration: 'none' }}>
                <div className="background-img">
                    <img src={'https://uploads.mangadex.org/covers/' + manga.id + '/' + cover + '.512.jpg'} alt={manga.attributes.title.en} />
                </div>
            </NavLink>
            <div className="banner-content">
                <NavLink to={`/manga/${manga.id}`} style={{ textDecoration: 'none' }}>
                    <div className="banner-image">
                        <Image src={'https://uploads.mangadex.org/covers/' + manga.id + '/' + cover + '.512.jpg'} alt={manga.attributes.title.en} ratio="4/6" />
                    </div>
                </NavLink>
                <div className="banner-info">
                    <div>
                        <NavLink to={`/manga/${manga.id}`} style={{ textDecoration: 'none' }}>
                            <h2>{((manga.attributes.title.en) || (manga.attributes.title.ja)) + ' - NO.' + rank}</h2>
                        </NavLink>
                        <div className="banner-tags">
                            {manga.attributes.tags.map((tag: any) => (
                                <Tag key={tag.id} tag={tag} />
                            ))}
                        </div>
                        <p>{manga.attributes.description.en}</p>
                    </div>
                    <h5>{(author === artist) ? (author) : (author + ', ' + artist)}</h5>
                    {/* Add more info sections here */}
                </div>
            </div>
        </div>
    );
};

export default Banner;