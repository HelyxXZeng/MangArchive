import { useNavigate } from "react-router-dom";
import Image from "../../imageResponsive/Image";
import "./comicCard.scss";

interface props {
  cover: string;
  title: string;
  comictype: string;
  maintag: string;
  id: string;
}

const ComicCard: React.FC<props> = (prop: props) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/manga/${prop.id}`);
  };
  return (
    <div className="comicCard" onClick={handleClick}>
      <div className="image">
        <Image
          className="cover"
          src={
            "https://mangapi.alse.workers.dev/uploads/covers/" +
            prop.id +
            "/" +
            prop.cover +
            ".512.jpg"
          }
          alt={prop.title}
          ratio="3/4"
        />
        {/* <img src={'https://mangapi.alse.workers.dev/uploads/covers/' + prop.id + '/' + prop.cover + '.512.jpg'} alt={prop.title} /> */}
      </div>
      <div className="info">
        <div className="name">
          <span className="title">{prop.title}</span>
        </div>
        <div className="smalltags">
          <span className="maintag">
            <span
              className={`type ${
                prop.comictype === "manga"
                  ? "mangatype"
                  : prop.comictype === "manhua"
                  ? "manhuatype"
                  : "manhwatype"
              }`}
            >
              {prop.comictype}
            </span>{" "}
            - {prop.maintag}
          </span>
        </div>
        <div className="chapterNView"></div>
      </div>
    </div>
  );
};

export default ComicCard;
