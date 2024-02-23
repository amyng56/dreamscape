import { Link, useNavigate } from "react-router-dom";

import { Button } from "../ui/button";
import { useAuthContext } from "../../context/AuthContext";

const serverMediaUrl = process.env.ENABLE_PROFILEPIC_CLOUDINARY === '1' ? "" : `${process.env.SERVER_URL}/uploads/`;

const Topbar = () => {
    const navigate = useNavigate();
    const { dispatch, user } = useAuthContext();

    const handleSignOut = async (e) => {
        e.preventDefault();
        dispatch({ type: 'LOGOUT' });
        navigate("/sign-in");
    };

    return (
        <section className="topbar">
            <div className="flex-between py-4 px-5">
                <Link to="/" className="flex gap-3 items-center">
                    <div className="flex items-center">
                        <img src="/assets/images/logo_without_font.png" alt="logo" className="h-10" />
                        <p className="ml-2 text-lg text-white font-semibold">Dreamscape</p>
                    </div>
                </Link>

                <div className="flex gap-4">
                    <Button
                        variant="ghost"
                        className="shad-button_ghost"
                        onClick={(e) => handleSignOut(e)}
                    >
                        <img src="/assets/icons/logout.svg" alt="logout" />
                    </Button>
                    <Link to={`/profile/${user.id}`} className="flex-center gap-3">
                        <img
                            src={user.profilePicture ? `${serverMediaUrl}${user.profilePicture}` : "/assets/icons/profile-placeholder.svg"}
                            alt="profile"
                            className="h-8 w-8 rounded-full"
                        />
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default Topbar;