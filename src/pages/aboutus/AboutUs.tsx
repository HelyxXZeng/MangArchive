import './aboutUs.scss'
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate(-1);

  return (
    <div className="aboutusframe">
      <div className="headernav">
        <button className="backbutton" onClick={handleBack}>
          <img src="/icons/arrow-left.svg" alt="" />
        </button>
        <div className="headerInfo">
          <h2>About Us</h2>
        </div>
      </div>
      <div className="content">
        <p>MangArchive is an innovative online platform dedicated to manga enthusiasts and scanlation groups alike. Created as a haven for both readers and scanlators, MangArchive functions not only as a comprehensive manga reader but also as a vibrant social network. </p>
        <p>Designed to be user-friendly, MangArchive empowers scanlation and translation groups, offering them full autonomy over their releases. Our platform thrives on community contributions, where content is uploaded by users, scanlation groups, and occasionally by the publishers themselves, fostering a dynamic and inclusive environment for manga lovers worldwide.</p>
        <div className="aboutsmall">
          <span>
            <p>MangArchive was created in</p>
            <h2 className='yellowtext'>March 2024</h2>
            <p> by 2 student in their school project.</p>
            <p>Number of current admins run the site:</p>
            <h2 className='redtext'>2</h2>
          </span>
        </div>
      </div>

    </div>
  )
}

export default AboutUs