import { useEffect, useState } from "react";
import Image from "../../../../components/imageResponsive/Image";
import "./media.scss";
import useCheckSession from "../../../../hooks/session";
import { supabase } from "../../../../utils/supabase";
import { useParams, useNavigate } from "react-router-dom";

const Media = () => {
  const session = useCheckSession();
  const [userInfo, setUserInfo] = useState<any>(null);
  const { username } = useParams<{ username: string }>();
  const [images, setImages] = useState<{ publicUrl: string; postId: number }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (username) {
          const { data, error } = await supabase
            .from("User")
            .select("*")
            .eq("username", username)
            .single();
          if (error) console.error(error);
          else {
            setUserInfo(data);
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, [username, session]);

  useEffect(() => {
    const fetchMediaImages = async () => {
      if (userInfo && userInfo.id) {
        try {
          const { data, error } = await supabase.rpc("get_media_image", {
            this_user_id: userInfo?.id,
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
              const linkObj = JSON.parse(image.link);
              return { publicUrl: linkObj.publicUrl, postId: image.post_id };
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
    return <div>Loading...</div>;
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
                navigate(`/profile/${username}/post/${image.postId}`)
              }
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Media;
