import GridPostList from './GridPostList';
import Loader from './Loader';

const SearchResults = ({ isSearchFetching, searchedPosts, token }) => {
    console.log('SearchResults: ', searchedPosts);
    if (isSearchFetching) {
        return <Loader />;
    } else if (searchedPosts && searchedPosts?.posts.length > 0) {
        return <GridPostList posts={searchedPosts?.posts} token={token} />;
    } else {
        return (
            <p className="text-light-4 mt-10 text-center w-full">No results found</p>
        );
    }
};

export default SearchResults;