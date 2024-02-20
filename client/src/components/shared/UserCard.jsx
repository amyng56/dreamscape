import { Link } from "react-router-dom";

import { Button } from "../ui/button";
import { useFollowUser } from "@/lib/react-query/queriesAndMutations";
import Loader from "./Loader";

const serverMediaUrl = `${process.env.SERVER_URL}/uploads/`;

const UserCard = ({ user, isFollowing = false, token, isCurrentUser }) => {
  const { mutate: followUser, isPending: isLoadingFollowUser } = useFollowUser(token);

  const handleFollowUser = (e) => {
    e.stopPropagation();
    followUser(user._id);
  };

  return (
    <div className="user-card">
      <Link to={`/profile/${user._id}`}>
        <img
          src={user.profilePicture ? `${serverMediaUrl}${user.profilePicture}` : "/assets/icons/profile-placeholder.svg"}
          alt="creator"
          className="rounded-full w-14 h-14"
        />

        <div className="flex-center flex-col gap-1">
          <p className="base-medium text-light-1 text-center line-clamp-1">
            {user.name}
          </p>
          <p className="small-regular text-light-3 text-center line-clamp-1">
            @{user.username}
          </p>
        </div>
      </Link>
      {isFollowing ?
        < Button
          type="button"
          size="sm"
          className="shad-button_primary px-5"
          disabled
        >
          Following
        </Button>
        :
        <Button
          type="button"
          size="sm"
          className="shad-button_primary px-5"
          onClick={(e) => handleFollowUser(e)}
          disabled={isLoadingFollowUser || isCurrentUser}
        >
          Follow
          {isLoadingFollowUser && <Loader />}
        </Button>
      }
    </div >
  );
};

export default UserCard;
