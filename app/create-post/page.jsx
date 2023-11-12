"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";



const CreatePost = () => {
  const [topic, setTopic] = useState('');
  const [urls, setUrls] = useState(['']);
  const [quizPost, setQuizPost] = useState('');
  const [loading, setLoading] = useState(false);
  // Additional state for storing the post ID
  const [postId, setPostId] = useState(null);
  const { data: session } = useSession();


  const addUrlField = () => setUrls([...urls, '']);
  const removeUrlField = (index) => setUrls(urls.filter((_, idx) => idx !== index));
  const updateUrlField = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  // Quiz submission handler
  const handleQuizSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const articleDetails = { topic, resources: urls.filter(url => url.trim()) };

    try {
      const response = await fetch('/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleDetails),
      });
      const data = await response.json();
      setQuizPost(data.post);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to extract hashtags from content
  const extractHashtags = (content) => {
    const regex = /#(\w+)/g;
    let hashtags = [];
    let match;

    while ((match = regex.exec(content)) !== null) {
      hashtags.push(match[1]);
    }

    return hashtags;
  };

  // Updated handlePublish function
  const handlePublish = async () => {
    setLoading(true);

    // Extract hashtags from the content
    const hashtags = extractHashtags(quizPost);

    const postDetails = {
      creatorId: session?.user.id,
      topic,
      urls: urls.filter(url => url.trim()),
      tag: hashtags.join(', '), // Joining hashtags with a comma
      content: quizPost
    };

    console.log(postDetails);

    try {
      const response = await fetch('/api/post/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postDetails),
      });
      const data = await response.json();
      setPostId(data._id); // Assuming the response contains the ID of the saved post
    } catch (error) {
      console.error('Error publishing:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to copy post content
  const copyContentToClipboard = async () => {
    await navigator.clipboard.writeText(quizPost);
    toast.success("Content copied to clipboard!");
  };


  // Function to reload the page
  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <>
    
    <toast/>
    <div className="info flex flex-col items-center pt-15">
      <h1 className="text-white mb-5">Generate Post</h1>

      {!quizPost && ( // Only show this form if quizPost is not set
        <form onSubmit={handleQuizSubmit} className="form-container flex flex-col items-center w-full">
          <div className="input-container mb-3 w-full">
            <input
              type="text"
              id="articleTopic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter the topic"
              required
              className="bg-transparent text-gray-300 border border-gray-300 mt-2 p-2 rounded w-full placeholder-gray-500"
            />
          </div>
          {urls.map((url, index) => (
            <div key={index} className="flex items-center mb-2">
              {index === 0 && (
                <button type="button" onClick={addUrlField} className="add-button bg-gray-800 text-white p-2 rounded cursor-pointer hover:bg-gray-700 mr-auto">+</button>
              )}
              <input
                type="text"
                placeholder={`URL ${index + 1}`}
                value={url}
                onChange={(e) => updateUrlField(index, e.target.value)}
                className="flex-grow bg-transparent text-gray-300 border border-gray-300 mr-2 p-2 rounded"
              />
              {index !== 0 && (
                <button type="button" onClick={() => removeUrlField(index)} className="remove-button bg-red-500 text-white p-2 rounded cursor-pointer hover:bg-red-600 ml-auto">-</button>
              )}
            </div>
          ))}
          <div className="flex items-center gap-10 mb-2">
            <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2 rounded cursor-pointer hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed mt-3">
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </form>
      )}

      {quizPost && (
        <>
          <div className="post-card text-gray-300 mt-5 p-5 rounded border border-gray-300 bg-transparent w-5/6">

            <p className="whitespace-pre-wrap">{quizPost}</p>

            {/* Copy to Clipboard Button */}
            <button onClick={copyContentToClipboard} className="copy-button bg-gray-500 text-white p-2 rounded cursor-pointer hover:bg-gray-600 mt-3">
              Copy
            </button>
          </div>


          <div className="flex gap-10">
            {/* Publish Button */}
            <button
              type="button"
              onClick={() => {
                handlePublish();
                reloadPage();
              }}              disabled={loading || postId}
              className="bg-blue-500 text-white p-2 rounded cursor-pointer hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed mt-3"
            >
              {loading ? 'Publishing...' : 'Publish'}
            </button>

            {/* Regenerate Button */}
            <button
              type="button"
              onClick={reloadPage}
              className="regenerate-button bg-orange-500 text-white p-2 rounded cursor-pointer hover:bg-orange-600 mt-3 ml-2"
            >
              Regenerate
            </button>
          </div>
        </>
      )}
    </div>
    </>
  );
};

export default CreatePost;
