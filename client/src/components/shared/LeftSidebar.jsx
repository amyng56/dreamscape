import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { sidebarLinks } from "@/constants";
import Loader from "./Loader";
import { Button } from "../ui/button";
import { useAuthContext } from "../../context/AuthContext";

const serverMediaUrl = process.env.ENABLE_PROFILEPIC_CLOUDINARY === '1' ? "" : `${process.env.SERVER_URL}/uploads/`;

const LeftSidebar = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { dispatch, user } = useAuthContext();

    const handleSignOut = async (e) => {
        e.preventDefault();
        dispatch({ type: 'LOGOUT' });
        navigate("/sign-in");
    };

    return (
        <nav className="leftsidebar">
            <div className="flex flex-col gap-11">
                <Link to="/" className="flex gap-3 items-center">
                    <div className="flex items-center">
                        <img src="/assets/images/logo_without_font.png" alt="logo" className="h-10" />
                        <p className="ml-2 text-lg text-white font-semibold">Dreamscape</p>
                    </div>
                </Link>

                {!user.email ? (
                    <div className="h-14">
                        <Loader />
                    </div>
                ) : (
                    <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
                        <img
                            src={user.profilePicture ? `${serverMediaUrl}${user.profilePicture}` : "/assets/icons/profile-placeholder.svg"}
                            alt="profile"
                            className="h-14 w-14 rounded-full"
                        />
                        <div className="flex flex-col">
                            <p className="body-bold">{user.name}</p>
                            <p className="small-regular text-light-3">@{user.username}</p>
                        </div>
                    </Link>
                )}

                <ul className="flex flex-col gap-6">
                    {sidebarLinks.map((link) => {
                        const isActive = pathname === link.route;

                        return (
                            <li
                                key={link.label}
                                className={`leftsidebar-link group ${isActive && "bg-primary-500"
                                    }`}>
                                <NavLink
                                    to={link.route}
                                    className="flex gap-4 items-center p-4">
                                    <img
                                        src={link.imgURL}
                                        alt={link.label}
                                        className={`group-hover:invert-white ${isActive && "invert-white"
                                            }`}
                                    />
                                    {link.label}
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <Button
                variant="ghost"
                className="shad-button_ghost"
                onClick={(e) => handleSignOut(e)}
            >
                <img src="/assets/icons/logout.svg" alt="logout" />
                <p className="small-medium lg:base-medium">Logout</p>
            </Button>
        </nav>
    )
}

export default LeftSidebar;