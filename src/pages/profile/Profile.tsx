import { useState } from "react"
import { useParams } from "react-router-dom";
import "./profile.scss"

const Profile = () => {
    const { username } = useParams();
  const [name, setName] = useState<any>(username);
  const [postcount, setPostcount] = useState(0);
  return (
    <div className="profileFrame">
        <div className="main">
            <section className="headernav">
                <button className="backbutton">
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
                <div className="background">
                    <img src="" alt="" />
                </div>
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
        <div className="suggestRight"></div>
    </div>
  )
}

export default Profile