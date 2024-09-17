import React, { useEffect, useState } from 'react'
import appwriteService from "../appwrite/config";
import { Container, PostCard } from '../components'
import bg1 from '/b6.jpg'
import './Home.css';
const Home = () => {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        appwriteService.getPosts().then((posts) => {
            if (posts) {
                setPosts(posts.documents)
            }
        })
    }, [])

    if (posts.length === 0) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                Login to Read Posts/Add posts
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className='w-full py-8'>
             <main  style={{backgroundImage:`url(${bg1})`,backgroundRepeat:'no-repeat',backgroundPosition:'center',backgroundSize:'1700px'}} className="bg-opacity-custom  main -mt-8 text:3xl min-h-[300px] xsm:text-5xl italic font-playfair font-semibold xsm:min-h-[500px] flex flex-col items-center justify-center">
                    <h1 className='text-blue-600 '>Your blog has the power</h1>
                    <p className='text-black '>to change lives,</p>
                    <p className=" text-blue-600">including your own</p>
                    
                </main>
            <Container>
               
                <div className='flex  flex-wrap mt-5'>

                    {posts.map((post) => (

                        <div key={post.$id} className='p-2 w-full sm:w-1/2 md:w-1/4  lg:w-1/4'>
                            <PostCard {...post} />

                        </div>
                    ))}
                </div>
                <div className='flex justify-center mt-10 text-sm text-black/50'>*Kindly head over to <span className='text-red-400 pr-1 pl-1'> All Posts </span>  section to Edit/Delete your posts</div>
            </Container>

        </div>
    )
}

export default Home
