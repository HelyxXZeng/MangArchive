import { Avatar, Button } from '@mui/material';
import "./postSection.scss"
import { NavLink } from 'react-router-dom'; // Ensure you've imported NavLink
import PostModal from '../../../modal/PostModal';
import { useState } from 'react';

const PostSection = () => {
    const onButtonClick =()=>{
        console.log("Open Post Model")
    }
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpen = () => setIsModalOpen(true);
    const handleClose = () => setIsModalOpen(false);
  return (
    <div className="postSectionComponent">
        <div className="postpress">
            <div className="avatarContainer">
              <NavLink to="/profile/test"> 
                <Avatar
                  className="Avatar"
                  src="https://cdn.donmai.us/original/5f/ea/__firefly_honkai_and_1_more_drawn_by_baba_ba_ba_mb__5feaaa99527187a3db0e437380ec3932.jpg"
                  alt="avatar"
                  sx={{ width: "40px", height: "40px" }} />
              </NavLink>
            </div>
            <div className="press">
                <Button className="click"
                    variant='contained'
                    onClick={handleOpen}>

                <span className="text">What's your take? Share to enlighten others!</span>
                </Button>
                <PostModal open={isModalOpen} handleClose={handleClose}/>
            </div>
        </div>
        <h4> Or you can </h4>
        <div className="navHistory">
            <NavLink to="/history">
                <Button className="click"
                    variant='contained'>
                <span className="text">Suggest your favorite Manga, Manhua, Manhwa to others!</span>
                </Button>
            </NavLink>
        </div>
    </div>
  );
}

export default PostSection;
