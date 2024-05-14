import "./Groups.scss"
import UserCardLarge from '../../../../components/socialComponents/userCardLarge/UserCardLarge'
import userList, { User } from "../../../../../public/User"
const Groups = () => {
    return (
        <div className="GroupListContainer">
            {userList.map((user: User, index: number) => (
                <UserCardLarge
                    key={index}
                    name={user.Name}
                    idName={user.ID}
                    followedState={true} // You can set the followed state as per your requirement
                    description={user.description}
                    level={user.level}
                />
            ))}
        </div>
    )
}


export default Groups