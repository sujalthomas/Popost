"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Form from "@components/Form";

const CreateEvent = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [submitting, setIsSubmitting] = useState(false);
  const [post, setPost] = useState({
    event: "", tag: "", time: "",
    date: "",
    location: "",
    attire: "",
    guestListCount: 0
  });

  const createEvent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Submitting Post Data:", post);
      // ... rest of your submission logic
    };
    
    handleSubmit(e);

    try {
      const response = await fetch("/api/event/new", {
        method: "POST",
        body: JSON.stringify({
          event: post.event,
          userId: session?.user.id,
          tag: post.tag,
          time: post.time,
          date: post.date,
          location: post.location,
          attire: post.attire,
          guestListCount: post.guestListCount,
        }),
      });



      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <Form
      type='Create'
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={createEvent}
    />
  );
};

export default CreateEvent;


