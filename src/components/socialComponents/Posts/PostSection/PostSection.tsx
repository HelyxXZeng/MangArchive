import { Avatar, Button } from '@mui/material';
import "./postSection.scss"
import { NavLink } from 'react-router-dom'; // Ensure you've imported NavLink
import PostModal from '../../../modal/postModal/PostModal';
import { useEffect, useState } from 'react';
import useCheckSession from '../../../../hooks/session';
import { supabase } from '../../../../utils/supabase';

interface Props{
    refreshList?: () => void;
}
const PostSection = (prop:Props) => {
    const onButtonClick =()=>{
        console.log("Open Post Model")
    }
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpen = () => setIsModalOpen(true);
    const handleClose = () => setIsModalOpen(false);
    const [userId, setUserId] = useState('');
    const session = useCheckSession();
    const [realUserID, setRealUserID] = useState<any>(null);
    const [profileImages, setProfileImages] = useState<{ avatar: string, background: string } | null>(null);

    useEffect(() => {
        const fetchUserId = async () => {
            if (session !== null) {
                try {
                    const { user } = session;
                    if (user) {
                        let { data, error } = await supabase.rpc("get_user_id_by_email", {
                            p_email: session.user.email,
                        });
                        if (error) console.error(error);
                        else {
                            setRealUserID(data);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching username:", error);
                }
            }
        };

        fetchUserId();
    }, [session]);
    useEffect(() => {
        const fetchProfileImages = async () => {
            try {
                if (realUserID) {
                    const { data, error } = await supabase.rpc("get_profile_image", { this_user_id: realUserID });
                    if (error) console.error(error);
                    else {
                        if (data[0]) {
                            const avatarLink = data[0].avatar_link ? JSON.parse(data[0].avatar_link).publicUrl : null;
                            const backgroundLink = data[0].background_link ? JSON.parse(data[0].background_link).publicUrl : null;

                            if (avatarLink || backgroundLink) {
                                setProfileImages({ avatar: avatarLink, background: backgroundLink });
                                // console.log({ avatar: avatarLink, background: backgroundLink });
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching profile images:", error);
            }
        };

        fetchProfileImages();
        // console.log(profileImages, realUserID)
    }, [realUserID]);
  return (
    <div className="postSectionComponent">
        <div className="postpress">
            <div className="avatarContainer">
              <NavLink to="/profile/test"> 
                <Avatar
                  className="Avatar"
                  src={profileImages?.avatar}
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
                <PostModal open={isModalOpen} handleClose={handleClose} refreshList={prop.refreshList}/>
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
