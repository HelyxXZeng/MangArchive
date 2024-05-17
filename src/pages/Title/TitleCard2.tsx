import React, { useState, useEffect } from 'react';
import { Card } from '@mui/material';
import Image from '../image/Image';
import './TitleCard2.scss';
import Tag from '../tag/Tag';
import { getDataApi } from '../../utils/MangaData';
import { Link } from 'react-router-dom';

interface Props {
  manga: any;
}

const MangaCard: React.FC<Props> = ({ manga }) => {
  const [cover, setCover] = useState('');
  const [author, setAuthor] = useState('');
  const [artist, setArtist] = useState('');
  const [title, setTitle] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const getCover = async () => {
    manga.relationships.forEach((relate: any) => {
      if (relate.type === 'cover_art') {
        setCover(relate.attributes?.fileName);
      }
    });
  }

  const getTime = async () => {
    getDataApi(manga.id)
      .then((returnData: any) => {
        const providedDate: Date = new Date(returnData.lastUpdate);
        const currentDate: Date = new Date();

        const differenceInMillis: number = currentDate.getTime() - providedDate.getTime();

        const seconds: number = Math.floor(differenceInMillis / 1000);
        const minutes: number = Math.floor(seconds / 60);
        const hours: number = Math.floor(minutes / 60);
        const days: number = Math.floor(hours / 24);
        const months: number = Math.floor(days / 30); // Approximate

        let adjustedTime = "";

        if (months > 0) {
          adjustedTime += `${months} month${months > 1 ? 's' : ''} ago`;
        } else if (days > 0) {
          adjustedTime += `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (hours > 0) {
          adjustedTime += `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (minutes > 0) {
          adjustedTime += `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else
          adjustedTime += `${seconds} second${seconds > 1 ? 's' : ''} ago`;

        setLastUpdated(adjustedTime);
      })
      .catch((error: any) => {
        console.error('Error:', error);
      });
  }

  const getTitle = () => {
    for (const key in manga.attributes.title) {
      if (Object.prototype.hasOwnProperty.call(manga.attributes.title, key)) {
        // Get the title associated with the current key
        const title = manga.attributes.title[key];
        // Check if title is a string
        if (typeof title === 'string') {
          // Assign the title to firstTitle and break out of the loop
          setTitle(title);
          return;
        }
      }
    }
  }

  const handleMouseEnter = () => {
    const timeoutId = setTimeout(() => {
      setShowPopup(true);
    }, 50); // 2000 milliseconds = 2 seconds
    return () => clearTimeout(timeoutId);
  };

  const handleMouseLeave = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    setAuthor(manga.relationships.find((r: any) => r.type === "author")?.attributes.name);
    setArtist(manga.relationships.find((r: any) => r.type === "artist")?.attributes.name);
    getCover();
    getTime();
    getTitle();
  }, []);

  return (
    <div className="manga-card"> {/* Use a wrapping div */}
      <Card className="manga-card-content1"> {/* Move Card component inside the div */}
        <div className="manga-card-image" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {showPopup && (
            <div className="popup-container">
              <Link to={`/manga/${manga.id}`} style={{ textDecoration: 'none' }}>
                <h1>{(manga.attributes.title.en) || (manga.attributes.title.ja) || (manga.attributes.title.ko) || (manga.attributes.title['ja-ro']) || (manga.attributes.title['ko-ro'])}</h1>
              </Link>
              <p>{(author === artist) ? (author) : (author + ', ' + artist)}</p>
              <h2>{'Status: ' + (manga.attributes.status)}</h2>
              <p>{(manga.attributes.description.en)}</p>
            </div>
          )}
          <div className="top-tag">
            {/* <Tag key={manga.attributes.tags[0].id} tag={manga.attributes.tags[0]} /> */}
            {/* <Tag tag = {manga.attributes.tags[0]}/> */}
          </div>
          <Image src={'https://uploads.mangadex.org/covers/' + manga.id + '/' + cover + '.512.jpg'} alt={manga.attributes.title.en} ratio="4/6" />
        </div>
        <Link to={`/manga/${manga.id}`} style={{ textDecoration: 'none' }}>
          <div className="title-and-artist-container">
            <h2>{title}</h2>
            <p className='author-artist'>{(author === artist) ? (author) : (author + ', ' + artist)}</p>
          </div>
        </Link>
        <div className="manga-card-content">
          <div className="tags">
            {manga.attributes.tags.map((tag: any) => (
              <Tag key={tag.id} tag={tag} />
            ))}
          </div>
          <p style={{ color: 'black' }}>{lastUpdated}</p>
        </div>
      </Card>
    </div>
  );
};

export default MangaCard;