import { useEffect, useState } from "react";
import Image from "../../../components/imageResponsive/Image";
import "../../SocialPage/ProfileChild/Media/media.scss";
import useCheckSession from "../../../hooks/session";
import { supabase } from "../../../utils/supabase";
import { useParams, useNavigate } from "react-router-dom";
import { phraseImageUrl } from "../../../utils/imageLinkPhraser";
import LoadingWave from "../../../components/loadingWave/LoadingWave";
import { fetchGroupData } from "../../../api/groupApi";

const GroupMedia = () => {
    const session = useCheckSession();
    const [userInfo, setUserInfo] = useState<any>(null);
    const { groupid } = useParams<{ groupid: string }>();
    const [images, setImages] = useState<{
        username: any; publicUrl: string; postId: number
    }[]>(
        []
    );
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                if (groupid) {
                    var data = await fetchGroupData(groupid);
                    setUserInfo(data);
                }
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        fetchUserInfo();
    }, [groupid, session]);

    useEffect(() => {
        const fetchMediaImages = async () => {
            if (userInfo && userInfo.id) {
                try {
                    const { data, error } = await supabase.rpc("get_group_media_images", {
                        this_group_id: userInfo?.id,
                    });
                    if (error) {
                        console.error(error);
                        throw new Error("Error fetching media images");
                    }
                    if (data.length === 0) {
                        setImages([]);
                    } else {
                        console.log(data);
                        const images = data.map((image: any) => {
                            return {
                                username: image.username,
                                publicUrl: phraseImageUrl(image.link),
                                postId: image.post_id,
                            };
                        });
                        setImages(images);
                    }
                } catch (error) {
                    console.error("Error fetching media images:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        if (userInfo?.id) {
            fetchMediaImages();
        }
    }, [userInfo]);

    if (isLoading) {
        return (
            <div className="NoMedia">
                <LoadingWave />
            </div>
        );
    }

    return (
        <>
            {images.length === 0 ? (
                <div className="NoMedia">This user has no media yet</div>
            ) : (
                <div className="mediaContainer">
                    {images.map((image, index) => (
                        <Image
                            className="smallimg"
                            key={index}
                            src={image.publicUrl}
                            alt={`Image ${index + 1}`}
                            ratio="1/1"
                            onClick={() =>
                                navigate(`/profile/${image.username}/post/${image.postId}`)
                            }
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default GroupMedia;