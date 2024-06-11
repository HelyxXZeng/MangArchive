import { useEffect, useState } from 'react';
import Image from '../../../image/Image';
import './media.scss';
import useCheckSession from '../../../../hooks/session';
import { supabase } from '../../../../utils/supabase';

const Media = () => {
  const session = useCheckSession();
  const [realUserID, setRealUserID] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserId = async () => {
      if (session !== null) {
        try {
          const { user } = session;
          if (user) {
            let { data, error } = await supabase.rpc("get_user_id_by_email", {
              p_email: session.user.email,
            });
            if (error) {
              console.error(error);
              throw new Error("Error fetching user ID");
            }
            setRealUserID(data);
          }
        } catch (error) {
          console.error("Error fetching username:", error);
        }
      }
    };

    fetchUserId();
  }, [session]);

  useEffect(() => {
    const fetchMediaImages = async () => {
      if (realUserID) {
        try {
          const { data, error } = await supabase.rpc("get_media_image", {
            this_user_id: realUserID,
          });
          if (error) {
            console.error(error);
            throw new Error("Error fetching media images");
          }
          if (data.length === 0) {
            setImages([]);
          } else {
            const imageLinks = data.map((image: any) => image.link);
            setImages(imageLinks);
          }
        } catch (error) {
          console.error("Error fetching media images:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (realUserID) {
      fetchMediaImages();
    }
  }, [realUserID]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {images.length === 0 ? (
        <div className='NoMedia'>This user has no media yet</div>
      ) : (
        <div className="mediaContainer">
          {images.map((image, index) => (
            <Image className="smallimg" key={index} src={image} alt={`Image ${index + 1}`} ratio='1/1' />
          ))}
        </div>
      )}
    </>
  );
};

export default Media;
