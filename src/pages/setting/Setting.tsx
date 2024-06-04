import { Button } from '@mui/material';
import './setting.scss'
import { useNavigate } from 'react-router-dom';

const Setting = () => {
    const navigate = useNavigate();
    const handleBack = () => navigate(-1);
    const handleAskAdmin = () => {
        window.open('https://forms.gle/AL1U8eWXCMFTtbkEA', '_blank');
    };
    return (
        <div className="settingFrame">
            <div className="headernav">
                <button className="backbutton" onClick={handleBack}>
                    <img src="/icons/arrow-left.svg" alt="" />
                </button>
                <div className="headerInfo">
                    <h2>Setting</h2>
                </div>
            </div>
            <h3>Account</h3>
            <div className="account">
                <div className="status">
                    <span className='content'>The current role of your account:</span>
                    <span className="role">User</span>
                </div>
                <div className="changeRoles">
                    <span>Ask Admin to upgrade your Role to a Translation Group?<br/><span className='smalldescription'>This process <span className='red'>can not be undone</span> after you send form to us. The form will take care in 24-72h.</span></span>
                    <Button className="clickhere" onClick={handleAskAdmin}>Click here</Button>
                </div>
            </div>
            <h3 className="danger">Danger Zone</h3>
            <div className="deleteAccount">
                <Button className="delete">
                    I want to delete my account
                </Button>
            </div>
        </div>
    )
}

export default Setting