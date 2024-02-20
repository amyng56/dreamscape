import { toast } from 'react-toastify';

import { Loader, UserCard } from "@/components/shared";
import { useGetUsers } from "@/lib/react-query/queriesAndMutations";
import { useAuthContext } from '../../context/AuthContext';

const AllUsers = () => {
  const { user, token } = useAuthContext();
  const { data: creators, isLoading, isError: isErrorCreators } = useGetUsers('all', token);

  const followingList = creators?.users
    .filter(userr => userr._id === user.id)
    .map(({ following }) => following || [])
    .flat();

  if (isErrorCreators) {
    toast.error("Something went wrong.", {
      hideProgressBar: true,
      theme: "dark",
    });

    return;
  }

  return (
    <div className="common-container">
      <div className="user-container">
        <div className="flex gap-2 w-full max-w-5xl">
          <img
            src="/assets/icons/people.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Discover People</h2>
        </div>

        {isLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            {creators?.users?.map((creator) => (
              creator._id !== user.id ?
                <li key={creator?._id} className="flex-1 min-w-[200px] w-full  ">
                  <UserCard user={creator} isFollowing={followingList.includes(creator._id)} token={token} />
                </li>
                : ""
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllUsers;