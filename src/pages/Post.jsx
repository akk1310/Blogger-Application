import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import authService from "../appwrite/auth";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

const Post = () => {
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState('')
    const { slug } = useParams();
    const navigate = useNavigate();
    // const [authorName, setAuthorName] = useState('');

    const userData = useSelector((state) => state.auth.userData);
    // const [currUser, setCurrUser] = useState(localStorage.getItem('currUser') || 'Guest')

   

    // console.log(post)
    // console.log(file)
    const isAuthor = post && userData ? post.userId === userData.$id : false;
    // console.log(isAuthor)
    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then(async (post) => {
                if (post) {
                    setPost(post);

                }
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredImage);
                navigate("/");
            }
        });
    };
   
    const addComment = async () => {
        if (comment.trim()) {
            // Fetch the logged-in user's name from userData
            const userName = userData.name || "Anonymous"; // Fallback to "Anonymous" if no name is available

            // Concatenate the user's name with the comment
            const newComment = `${userName}: ${comment}`;

            // Append the new comment to the existing comments array
            const updatedComments = [...(post.comments || []), newComment];

            // Save the updated comments array to the backend
            await appwriteService.updatePost(post.$id, { comments: updatedComments });

            // Update local state with the new comments array
            setPost({ ...post, comments: updatedComments });

            // Clear the comment input field
            setComment('');
        }
    };

    return post ? (
        <div className="py-8">
            <Container>
                <div className="w-full flex justify-center mb-4 relative border border-black/20 rounded-xl p-2">
                    <img
                        src={appwriteService.getFilePreview(post.featuredImage)}
                        alt={post.title}
                        className="rounded-xl"
                    />

                    {isAuthor && (
                        <div className="absolute right-6 top-6">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-green-500" className="mr-3">
                                    Edit
                                </Button>
                            </Link>
                            <Button bgColor="bg-red-500" onClick={deletePost}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                <div className="w-full mb-6">
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                    <p className="text-sm text-gray-600">By <span className='text-green-600 text-lg'>{post.authorName || 'Unknown Author'}</span> </p>
                    <p className="text-sm text-gray-600">Date Posted: <span className='text-red-600'>{new Date(post.postDate).toLocaleDateString() || 'Unknown Date'}</span> </p>
                </div>
                {/* <div className="w-full mb-6">
                    <h1 className="text-xl font-bold">{authorName}</h1>
                </div> */}
                <div className="browser-css bg-slate-200 border p-2 rounded-xl  ">
                    {parse(post.content)}
                </div>


                {/* Comments Section */}
                <div className="border-2 mt-10 p-2 flex flex-col gap-5 border-black/20 rounded">
                    <h2 className="text-gray-600">Comments</h2>

                    {/* Display existing comments */}
                    {post.comments && post.comments.map((cmt, index) => {
                        // Split the comment string to extract the user's name and comment text
                        const [userName, commentText] = cmt.split(': ', 2);

                        return (
                            <div key={index} className='flex'>
                                <img className='rounded-full border-2 border-black/20 h-12 w-12 m-2' src="/up.jpg" alt="user_prof" />
                                <div>
                                    <div className='text-sm'>{userName}</div> {/* Display the user's name */}
                                    <div className='border-2 border-black/30 rounded min-w-96 p-2 flex items-center'>{commentText}</div> {/* Display the comment text */}
                                </div>
                            </div>
                        );
                    })}

                    {/* Comment Input */}
                    {userData && (
                        <div className="mt-4">
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="w-full border p-2 rounded"
                            />
                            <Button bgColor="bg-blue-500" onClick={addComment}>
                                Post Comment
                            </Button>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    ) : null;
}

export default Post
