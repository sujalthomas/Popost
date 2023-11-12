"use client"

import Link from "next/link";
import Places from "@app/api/maps/places";
import { useState } from "react";

const Form = ({ type, post, setPost, submitting, handleSubmit }) => {
  const [location, setLocation] = useState("");  // <-- add this line

  return (
    <section className='w-full max-w-full flex-start flex-col'>
      <h1 className='head_text text-left'>
        <span className='blue_gradient'>{type} Event</span>
      </h1>
      <p className='desc text-left max-w-md'>
        {type}, Manage, Organize, and Anticipate your big day's attendees with ease.
      </p>

      <form
        onSubmit={handleSubmit}
        className='mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism'
      >
        <label>
          <span className='font-satoshi font-semibold text-base text-gray-700'>
            Event Name
          </span>

          <input
            value={post.event}
            onChange={(e) => setPost({ ...post, event: e.target.value })}
            type='text'
            placeholder='Name your event here'
            required
            className='form_input '
          />
        </label>

<div className="flex justify-between items-center gap-5">
  <label className="flex-1">
    <span className='font-satoshi font-semibold text-base text-gray-700'>
      Date of the event
    </span>
    <input
      value={post.date}
      onChange={(e) => setPost({ ...post, date: e.target.value })}
      type='date'
      placeholder='mm/dd/yyyy'
      required
      className='form_input'
    />
  </label>

  <label className="flex-1">
    <span className='font-satoshi font-semibold text-base text-gray-700'>
      Time of the event
    </span>
    <input
      value={post.time}
      onChange={(e) => setPost({ ...post, time: e.target.value })}
      type='time'
      placeholder='Event Time'
      required
      className='form_input'
    />
  </label>
</div>


        <label className="block relative">
  <span className='font-satoshi font-semibold text-base text-gray-700'>Location</span>
  <div className="relative">
    <Places
      value={location}
      onChange={setLocation}
      onSelect={(selectedAddress) => {
        setLocation(selectedAddress);
        setPost({ ...post, location: selectedAddress });
      }}
    />
  </div>
</label>





<div className="flex justify-between items-center gap-5">
  <label className="flex-1">
  <span className='font-satoshi font-semibold text-base text-gray-700'>
            Attire
          </span>
          <input
            value={post.attire}
            onChange={(e) => setPost({ ...post, attire: e.target.value })}
            type='text'
            placeholder='Attire'
            required
            className='form_input'
          />
        </label>

  <label className="flex-1">
  <span className='font-satoshi font-semibold text-base text-gray-700'>
            Guest List
          </span>
          <input
            value={post.guestListCount}
            onChange={(e) => setPost({ ...post, guestListCount: e.target.value })}
            type='number'
            placeholder='Guest List'
            required
            className='form_input'
          />
        </label>
</div>



        <label>
          <span className='font-satoshi font-semibold text-base text-gray-700'>
            Themes{" "}
            <span className='font-normal text-sm'>
              ( #use, #hashtags, #to, #define, #your, #themes )
            </span>
          </span>
          <input
            value={post.tag}
            onChange={(e) => setPost({ ...post, tag: e.target.value })}
            type='text'
            placeholder='#Tag'
            required
            className='form_input'
          />
        </label>





        <div className='flex-end mx-3 mb-5 gap-4'>
          <Link href='/' className='text-gray-500 text-sm'>
            Cancel
          </Link>

          <button
            type='submit'
            disabled={submitting}
            className='px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white'
          >
            {submitting ? `${type}ing...` : type}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Form;
