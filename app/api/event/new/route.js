import Event from "@models/event";
import { connectToDB } from "@utils/database";

export const POST = async (request) => {
                                    const { userId, event, tag, time, date, location, attire, guestListCount } = await request.json();

    try {
        await connectToDB();
        const newEvent = new Event({ creator: userId, event, tag, time, date, location, attire, guestListCount });

        console.log(newEvent);

        await newEvent.save();
        return new Response(JSON.stringify(newEvent), { status: 201 })
    } catch (error) {
        return new Response("Failed to create a new event", { status: 500 });
    }
}
