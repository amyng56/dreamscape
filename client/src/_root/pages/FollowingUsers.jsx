import { toast } from 'react-toastify';

import { Loader, UserCard } from "@/components/shared";
import { useGetFollowingUsersById } from "@/lib/react-query/queriesAndMutations";
import { useAuthContext } from '../../context/AuthContext';

const FollowingUsers = ({ currentProfileUserId, currentUserFollowingList}) => {
  const { user, token } = useAuthContext();
  const { data, isLoading, isError: isErrorGettingCreators } = useGetFollowingUsersById(currentProfileUserId, token);

  if (isErrorGettingCreators) {
    toast.error("Something went wrong.", {
      hideProgressBar: true,
      theme: "dark",
    });

    return;
  }

  return (
    <div className="user-container">
      {isLoading && !data ? (
        <Loader />
      ) : (
        <ul className="user-grid">
          {data?.users?.map((follower) => (
            <li key={follower?._id} className="flex-1 min-w-[200px] w-full  ">
              <UserCard user={follower} isFollowing={currentUserFollowingList.includes(follower._id)} token={token} isCurrentUser={follower._id === user.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FollowingUsers;