import { Link } from 'react-router-dom';
import LogOut from '../pics/logout.png'
import './Background.css'

function Lower() {
    const handleLogout = () => {
        localStorage.removeItem('jwt');
    }

    return (
        <div className="block block4 text-bg-success">
            <Link to='/' onClick={handleLogout} type="button" className="btn btn-danger bar10 foo1"
                data-bs-toggle="tooltip" data-bs-placement="bottom"
                data-bs-custom-class="custom-tooltip" data-bs-html="true"
                data-bs-title="Can't <b><u>Disconnect!</u></b>">
                <img src={LogOut}
                    alt=' '></img></Link>
        </div>
    );
}

export default Lower;
