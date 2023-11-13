"use client";
import PromptCard from "./PromptCard";

import React, { useState, useEffect } from 'react';

const Profile = ({ name, desc, data, handleEdit, handleDelete }) => {
  const [apiKey, setApiKey] = useState('');
  const [isKeySet, setIsKeySet] = useState(false);

  useEffect(() => {
    // Check if an API key is already stored
    const storedKey = localStorage.getItem('openAIKey');
    if (storedKey) {
      setApiKey(storedKey);
      setIsKeySet(true);
    }
  }, []);

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
  };

  const validateAndSetKey = () => {
    const isValidKey = /^sk-\w+$/.test(apiKey); // Basic regex for validation
    if (isValidKey) {
      setIsKeySet(true);
      localStorage.setItem('openAIKey', apiKey); // Store in local storage or manage in global state
    } else {
      alert('Invalid API Key');
    }
  };

  const handleDeleteKey = () => {
    localStorage.removeItem('openAIKey');
    setApiKey('');
    setIsKeySet(false);
  };

  return (
    <section className='w-full'>
      <h1 className='head_text text-left'>
        <span className='blue_gradient'>{name} Profile</span>
      </h1>

<div className="flex items-center gap-5 mt-9">

      <p className='desc text-left'>{desc}</p>

      <div className="flex items-center space-x-2">

  <label className="flex-grow flex items-center space-x-2">
    <input
      type={isKeySet ? 'password' : 'text'}
      placeholder='OpenAI API Key'
      value={apiKey}
      onChange={handleApiKeyChange}
      disabled={isKeySet}
      className="flex-grow rounded p-2 mt-1 focus:outline-none"
    />

    {!isKeySet && (
      <button
        className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        onClick={validateAndSetKey}
        aria-label="Set API Key"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
        Set
      </button>
    )}

    {isKeySet && (
      <button
        className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        onClick={handleDeleteKey}
        aria-label="Delete API Key"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
        Delete
      </button>
    )}
  </label>
</div>

</div>



      <div className='mt-10 prompt_layout'>
        {data.map((post) => (
          <PromptCard
            key={post._id}
            post={post}
            handleEdit={() => handleEdit && handleEdit(post)}
            handleDelete={() => handleDelete && handleDelete(post)}
          />
        ))}
      </div>
    </section>
  );
};

export default Profile;
