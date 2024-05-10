import React, { useState, useEffect } from 'react';
import { Card } from '@mui/material';
import Image from '../image/Image';
import './TitleCard2.scss';
import Tag from '../tag/Tag';

// interface Manga {
//   id: string;
//   attributes: {
//     title: {
//       en: string;
//     };
//     cover_art: string;
//     description: {
//       en: string;
//       ja: string;
//     };
//     // tags: string[];
//   };
//   relationships: Relate[];
// }

// interface Relate {
//   id: string;
//   type: string;
//   attributes: {
//     fileName: string;
//     locale: string;
//   }
// }

interface Props {
  manga: any;
}

const MangaCard: React.FC<Props> = ({ manga }) => {
  const [cover, setCover] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  // function resizeImage(url: string, width: number) {
  //   return `https://images.weserv.nl/?url=https://services.f-ck.me/v1/image/${btoa(url).replace(/\+/g, "-").replace(/\//g, "_")}&w=${width}`
  // }

  const getCover = async() => {
    manga.relationships.forEach((relate: any) => {
        if (relate.type === 'cover_art') {
            setCover(relate.attributes?.fileName);
            // console.log('relationships: ', manga.relationships.map((relate: any) => relate.type + relate.attributes?.fileName));
            // console.log('Got cover:', cover, '/', manga.id);
            // console.log('https://uploads.mangadex.org/covers/' + manga.id + '/' + cover);
        }
    });
    // manga.attributes.tags.forEach((tag: any) => (
    //   console.log(tag.attributes.name.en)
    // ));
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
    getCover();
  }, []);

  return (
    // <div className="manga-card">
    //   <img src={manga.attributes.cover_art} alt={manga.attributes.title.en} />
    //   <h2>{manga.attributes.title.en}</h2>
    //   <p>{manga.attributes.description.en}</p>
    //   <div className="tags">
    //     {/* {manga.attributes.tags.map((tag, index) => (
    //       <span key={index}>{tag}</span>
    //     ))} */}
    //   </div>
    // </div>

    // <Card className="manga-card"> {/* Use className instead of inline style */}
    //   <div className="manga-card-image">
    //     <Image src={'https://uploads.mangadex.org/covers/' + manga.id + '/' + cover} alt={manga.attributes.title.en} ratio='4/6' />
    //   </div>
    //   <div className="manga-card-content">
    //     <h2>{manga.attributes.title.en}</h2> {/* Display manga title */}
    //     <p>{manga.attributes.description.en}</p>
    //     <div className="tags">
    //       {/* Render tags if available */}
    //       {/* {manga.attributes.tags && manga.attributes.tags.map((tag, index) => (
    //         <span key={index}>{tag}</span>
    //       ))} */}
    //     </div>
    //   </div>
    // </Card>

    <div className="manga-card"> {/* Use a wrapping div */}
      <Card className="manga-card-content1"> {/* Move Card component inside the div */}
        <div className="manga-card-image" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {/* {showPopup && (
            <div className="popup-container">
              <h2>{(manga.attributes.title.en) || (manga.attributes.title.ja)}</h2>
            </div>
          )} */}
          <Image src={'https://uploads.mangadex.org/covers/' + manga.id + '/' + cover + '.512.jpg'} alt={manga.attributes.title.en} ratio="4/6" />
        </div>
        <div className="manga-card-content">
          <h2>{(manga.attributes.title.en) || (manga.attributes.title.ja)}</h2>
          {/* <p>{manga.attributes.description.en}</p> */}
          <div className="tags">
            {manga.attributes.tags.map((tag: any) => (
              <Tag tag={tag}/>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MangaCard;