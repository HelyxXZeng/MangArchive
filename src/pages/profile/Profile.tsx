import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import "./profile.scss"

const Profile = () => {
    const navigate = useNavigate();
    const { username } = useParams<{ username: string }>();
    const handleBack=() => navigate(-1);
  const [name, setName] = useState<any>(username);
  const [postcount, setPostcount] = useState(0);
  return (
    <div className="profileFrame">
        <div className="main">
            <section className="headernav">
                <button className="backbutton" onClick={handleBack}>
                    <img src="/icons/arrow-left.svg" alt="" />
                </button>
                <div className="headerInfo">
                    <div className="name">
                        {name}
                    </div>
                    <div className="postCount">
                        {postcount} bài đăng
                    </div>
                </div>
            </section>
            <div className="profileFrame">
                    <img className="background" src="https://cdn.donmai.us/original/ba/da/__robin_honkai_and_1_more_drawn_by_rsef__badad19e219a773536c434f47d03463f.jpg" alt="" />
                    {/* <img className="background" src="https://wallup.net/wp-content/uploads/2019/09/726722-landscape.jpg" alt="" /> */}
                
                <div className="info">
                    <img src="" alt="" />
                </div>
                <div className="buttonOption">

                </div>
            </div>
            <div className="userThings">
                <div className="optionbar">

                </div>
                <div className="postlist">

                </div>
            </div>
        </div>
    </div>
  )
}

export default Profile