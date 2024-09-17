import React, { useCallback,useEffect,useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input, Select, RTE } from '../index'
import appwriteService from "../../appwrite/config"
import authService from "../../appwrite/auth"
import { useNavigate } from 'react-router-dom'
import { useSelector,useDispatch } from 'react-redux'
import { login } from '../../store/authSlice'


const PostForm = ({ post }) => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are 0-based
    const year = date.getFullYear();
    let currentDate=`${day}/${month}/${year}`

    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || '',
            slug: post?.$id || '',
            content: post?.content || '',
            status: post?.status || 'active',
        }
    })

    const navigate = useNavigate()
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.userData)
    // const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
    

    
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
    }, [dispatch, userData]);

    

    const submit = async (data) => {
        // if (!isUserDataLoaded) {
        //     console.error("User data is not loaded or user ID is missing.");
        //     return;
        // }
        if (post) {
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

            if (file) {
                appwriteService.deleteFile(post.featuredImage)
            }

            const dbPost = await appwriteService.updatePost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined,
                authorName: userData.name,
                postDate: currentDate,

            })
            if (dbPost) {
                navigate(`/post/${dbPost.$id}`)
            }

        } else {
            const file = await appwriteService.uploadFile(data.image[0])
            console.log("file",file)

            if (file) {
                const fileId = file.$id
                // const useId=userData.$id
                // data.featuredImage = fileId
                const dbPost = await appwriteService.createPost({
                    ...data,
                    featuredImage:fileId,
                    userId: userData.$id,
                    authorName: userData.name,
                    postDate: currentDate, 
                    // userId: useId,
                    // userId: fileId,

                })
                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`)
                }
            }

        }

    }

    const slugTransform = useCallback((value) => {
        if (value && typeof (value) === 'string') {
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        }
        return ""
    }, [])

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true })
            }
        })

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue])

    // if (!isUserDataLoaded) {
    //     return <div>User data is not available. Please try refreshing the page.</div>;
    // }


    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className=" 2xl:w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-full lg:w-1/2  2xl:w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    )
}

export default PostForm