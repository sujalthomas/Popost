import { Schema, model, models } from 'mongoose';

const PostSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  topic: {
    type: String,
    required: [true, 'Topic is required.'],
  },
  urls: [{
    type: String,
    required: [true, 'URL is required.']
  }],
  tag: {
    type: String,
    required: [true, 'Tag is required.'],
  },
  content: {
    type: String,
    required: [true, 'Content is required.']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Post = models.Post || model('Post', PostSchema);

export default Post;
