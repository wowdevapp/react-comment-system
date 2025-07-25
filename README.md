# React Comment System

A modern, customizable comment system component for React applications with TypeScript and Tailwind CSS support.

## Features

- 💬 Threaded comments with nested replies
- 👍 Like functionality
- 🗑️ Comment deletion
- 🎨 Tailwind CSS styling
- 📱 Responsive design
- 🔢 TypeScript support
- ⚡ Zero dependencies (except peer dependencies)
- 🎯 Event callbacks for state management

## Installation

```bash
# npm
npm install react-comment-system

# yarn
yarn add react-comment-system

# pnpm
pnpm add react-comment-system
```

### Peer Dependencies

This package requires the following peer dependencies:

```json
{
  "react": "^17.0.0 || ^18.0.0",
  "react-dom": "^17.0.0 || ^18.0.0",
  "tailwindcss": "^3.0.0"
}
```

## Usage

```tsx
import { CommentSystem } from "react-comment-system";

// Example initial comments
const initialComments = [
  {
    id: 1,
    text: "Great post!",
    author: "John Doe",
    timestamp: new Date().toISOString(),
    likes: 0,
    replies: [],
  },
];

function App() {
  const handleCommentAdd = (comment) => {
    console.log("New comment:", comment);
    // Handle comment addition
  };

  const handleCommentDelete = (commentId) => {
    console.log("Deleted comment:", commentId);
    // Handle comment deletion
  };

  const handleCommentLike = (commentId) => {
    console.log("Liked comment:", commentId);
    // Handle like action
  };

  return (
    <CommentSystem
      initialComments={initialComments}
      onCommentAdd={handleCommentAdd}
      onCommentDelete={handleCommentDelete}
      onCommentLike={handleCommentLike}
      className="my-custom-class"
    />
  );
}
```

## Props

| Prop              | Type                          | Required | Default | Description                        |
| ----------------- | ----------------------------- | -------- | ------- | ---------------------------------- |
| `initialComments` | `Comment[]`                   | No       | `[]`    | Initial comments to display        |
| `onCommentAdd`    | `(comment: Comment) => void`  | No       | -       | Callback when a comment is added   |
| `onCommentDelete` | `(commentId: number) => void` | No       | -       | Callback when a comment is deleted |
| `onCommentLike`   | `(commentId: number) => void` | No       | -       | Callback when a comment is liked   |
| `className`       | `string`                      | No       | `''`    | Additional CSS classes             |

### Comment Type

```typescript
interface Comment {
  id: number;
  text: string;
  author: string;
  timestamp: string;
  likes: number;
  replies: Comment[];
  parentId?: number;
}
```

## Styling

The component uses Tailwind CSS for styling. Make sure to include Tailwind CSS in your project:

```js
// tailwind.config.js
module.exports = {
  content: [
    // ...
    "./node_modules/react-comment-system/**/*.{js,ts,jsx,tsx}",
  ],
  // ...
};
```

## Examples

### Basic Usage

```tsx
<CommentSystem initialComments={[]} />
```

### With Custom Event Handlers

```tsx
<CommentSystem
  initialComments={comments}
  onCommentAdd={(comment) => {
    saveCommentToDatabase(comment);
    updateLocalState(comment);
  }}
  onCommentDelete={async (id) => {
    await deleteCommentFromDatabase(id);
    removeFromLocalState(id);
  }}
/>
```

### With Custom Styling

```tsx
<CommentSystem
  className="dark:bg-gray-800 dark:text-white"
  initialComments={comments}
/>
```

## Development

```bash
# Install dependencies
npm install

# Build package
npm run build

# Run tests
npm test

# Run development server
npm run dev
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © [Your Name]

## Support

If you like this project, please give it a ⭐️ on GitHub! https://github.com/wowdevapp/react-comment-system

For issues and feature requests, please [create an issue](https://github.com/wowdevapp/react-comment-system/issues).
