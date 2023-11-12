import Post from "@models/post";
import { connectToDB } from "@utils/database";

export const POST = async (request) => {
    try {

        const { creatorId, topic, urls, tag, content } = await request.json();

        try {
            await connectToDB();
            const newPost = new Post({ creator: creatorId, topic, urls, tag, content });

            await newPost.save();
            return new Response(JSON.stringify(newPost), { status: 201 });
        } catch (error) {
            return new Response("Failed to create a new post", { status: 500 });
        }
    } catch (error) {
        console.error("Error in POST route:", error);
        return new Response("Error processing request", { status: 500 });
    }
}
