"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon, LinkedinShareButton, LinkedinIcon } from 'react-share';


const PromptCard = ({ post, handleDelete, handleTagClick }) => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();

  const [copied, setCopied] = useState("");
  const [isExpanded, setIsExpanded] = useState(false); // State to manage content visibility
  const shareUrl = window.location.href;
  const title = post.content; 


  const handleProfileClick = () => {
    console.log(post);

    if (post.creator._id === session?.user.id) return router.push("/profile");

    router.push(`/profile/${post.creator._id}?name=${post.creator.username}`);
  };

  const handleCopy = () => {
    setCopied(true);
    navigator.clipboard.writeText(post.content);
    setTimeout(() => setCopied(false), 3000);
  };

  

  const toggleContent = () => setIsExpanded(!isExpanded); // Function to toggle content visibility

  
  return (
    <div className='prompt_card' onClick={toggleContent}>
      <div className='flex justify-between items-start gap-5'>
        <div
          className='flex-1 flex justify-start items-center gap-3 cursor-pointer'
          onClick={handleProfileClick}
        >
          <Image
            src={post.creator.image}
            alt='user_image'
            width={40}
            height={40}
            className='rounded-full object-contain'
          />

          <div className='flex flex-col'>
            <h3 className='font-satoshi font-semibold text-gray-900'>
              {post.creator.username}
            </h3>
            <p className='font-inter text-sm text-gray-500'>
              {post.creator.email}
            </p>
          </div>
        </div>

        <div className='copy_btn' onClick={handleCopy}>
          <Image
            src={
              copied === post.content
                ? "/assets/icons/tick.svg"
                : "/assets/icons/copy.svg"
            }
            alt={copied === post.content ? "tick_icon" : "copy_icon"}
            width={12}
            height={12}
          />
        </div>
      </div>

{/* Conditional rendering based on isExpanded */}
{isExpanded ? (
        <div>
          <p className='my-4 font-satoshi text-sm text-slate-200'>{post.content}</p>
        </div>
      ) : (
        <div>
          <h4 className='pt-2 font-satoshi font-semibold text-base text-slate-200'>{post.topic}</h4>
          <p
        className='font-inter text-sm blue_gradient cursor-pointer'
        onClick={() => handleTagClick && handleTagClick(post.tag)}
      >
        #{post.tag}
      </p>
        </div>
      )}


      {session?.user.id === post.creator._id && pathName === "/profile" && (
        <div className='mt-5 flex-center gap-4 border-t border-gray-100 pt-3'>
          {/* Share Buttons */}
          <FacebookShareButton url={shareUrl} quote={title}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>

          <TwitterShareButton url={shareUrl} title={title}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>

          <LinkedinShareButton url={shareUrl} title={title}>
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>

          {/* Delete Button */}
          <p
            className='pl-10 font-inter text-sm orange_gradient cursor-pointer'
            onClick={handleDelete}
          >
            Delete
          </p>
        </div>
      )}
    </div>
  );
};

export default PromptCard;
