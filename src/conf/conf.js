const conf = {
    appwriteUrl:String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId:String(import.meta.env.VITE_APPWRITE_PROJECT_id),
    appwriteDatabaseId:String(import.meta.env.VITE_APPWRITE_DATABSE_id),
    appwriteCollectionId:String(import.meta.env.VITE_APPWRITE_COLLECTION_id),
    appwriteBucketId:String(import.meta.env.VITE_APPWRITE_BUCKET_id),
    TinyMCE_API_Id:String(import.meta.env.VITE_TINYMCE_API_ID),
};

export default conf

