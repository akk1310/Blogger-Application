import React,{useState, useEffect} from 'react'
import appwriteService from '../appwrite/config'
import { Container,PostCard } from '../components'
import { useSelector,useDispatch } from 'react-redux'
import { login } from '../store/authSlice'
import authService from "../appwrite/auth"

const AllPosts = () => {
    const [posts, setPosts] = useState([])
    const [filteredPosts, setFilteredPosts] = useState([]);
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.userData)    
  
        useEffect(() => {
            const fetchPosts = async () => {
                try {
                    const fetchedPosts = await appwriteService.getPosts([]);
                    if (fetchedPosts) {
                        setPosts(fetchedPosts.documents);
                    }
                } catch (error) {
                    console.error("Error fetching posts:", error);
                }
            };
    
            fetchPosts();
        }, []);

        useEffect(() => {
            const filterPosts = () => {
                if (userData) {
                    const filtered = posts.filter(post => 
                        post.status === 'active' || post.userId === userData.$id
                    );
                    setFilteredPosts(filtered);
                }
            };
    
            filterPosts();
        }, [posts, userData]);

        useEffect(() => {
            console.log('Filtered Posts:', filteredPosts);
        }, [filteredPosts]);

useEffect(() => {
    const fetchUserData = async () => {
        try {
            const currentUser = await authService.getCurrentUser();
            if (currentUser) {
                dispatch(login({ userData: currentUser }));
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    if (!userData) {
        fetchUserData();
    }
}, [dispatch]);


  return (
    <div className='w-full py-8'>
        <Container>
            <div className='flex flex-wrap '>
                {filteredPosts.map((post) => (
                    <div key={post.$id} className='p-2 w-full sm:w-1/2 md:w-1/4  lg:w-1/4'>
                        <PostCard {...post} />
                    </div>
                ))}
            </div>

        </Container>
      
    </div>
  )
}

export default AllPosts
