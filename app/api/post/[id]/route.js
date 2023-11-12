import Post from "@models/post";
import { connectToDB } from "@utils/database";

export const GET = async (request, { params }) => {
    try {
        await connectToDB();

        const post = await Post.findById(params.id).populate("creator");
        if (!post) return new Response("Post not found", { status: 404 });

        return new Response(JSON.stringify(post), { status: 200 });

    } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
    }
}

export const PATCH = async (request, { params }) => {
    const { topic, urls, tag, content } = await request.json();

    try {
        await connectToDB();

        const existingPost = await Post.findById(params.id);
        if (!existingPost) return new Response("Post not found", { status: 404 });

        existingPost.topic = topic;
        existingPost.urls = urls;
        existingPost.tag = tag;
        existingPost.content = content;

        await existingPost.save();

        return new Response("Successfully updated the post", { status: 200 });
    } catch (error) {
        return new Response("Error updating post", { status: 500 });
    }
};

export const DELETE = async (request, { params }) => {
    try {
        await connectToDB();

        await Post.findByIdAndRemove(params.id);

        return new Response("Post deleted successfully", { status: 200 });
    } catch (error) {
        return new Response("Error deleting post", { status: 500 });
    }
};
