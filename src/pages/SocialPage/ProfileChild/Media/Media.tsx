import Image from '../../../image/Image';
import './media.scss';

const Media = () => {
    const images = [
        'https://cdn.donmai.us/original/f2/dd/__acheron_honkai_and_1_more_drawn_by_szlljxk__f2dd492d1ef8fbaa4c8a0f0cabc280ed.jpg',
        'https://cdn.donmai.us/original/d2/1b/__robin_honkai_and_1_more_drawn_by_himey__d21bab2de5bbe278d34f85f42664b4fc.jpg',
        'https://cdn.donmai.us/original/6d/aa/__black_swan_honkai_and_1_more_drawn_by_chiyikoupangsanjin__6daa01579c497f2530ce4ca1e595b7b9.jpg',
        'https://cdn.donmai.us/original/0a/54/__robin_honkai_and_1_more_drawn_by_kbnimated__0a54c19422393c4bcc3a90b10b3e8553.jpg',
        'https://cdn.donmai.us/original/35/ef/__sparkle_honkai_and_1_more_drawn_by_chllin0__35efb83264a76b153fb5426a6fd64272.jpg',
        'https://cdn.donmai.us/original/90/6f/__firefly_sparkle_and_robin_honkai_and_1_more_drawn_by_al_guang__906fcdef5bf7b32c964cdae96ea1077d.jpg',
        "https://cdn.donmai.us/original/cb/f8/__robin_honkai_and_1_more_drawn_by_yonesdraws__cbf882b023f0ce26eea3b11e0f7cc9cd.jpg"
      ];
    
  return (
    <div className="mediaContainer">
        {images.map((image, index) => (
        <Image className="smallimg" key={index} src={image} alt={`Image ${index + 1}`} ratio='1/1'/>
      ))}
    </div>
  )
}

export default Media