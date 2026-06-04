# Blog CMS Platform

This repository is the frontend part of a full-stack blogging platform. The backend is located in the sibling folder:

```text
d:\BLOG\blog-cms
```

The full project contains:

- `BlogCMS-Frontend`: Next.js frontend.
- `blog-cms`: Express and MongoDB backend API.

## Features

- User registration and login.
- Blog discovery with search, category filters, tag filters, and pagination.
- Blog detail pages with likes and comments.
- Author workflows for creating, editing, deleting, saving drafts, and publishing blogs.
- Responsive reading experience.
- Admin dashboard and post management screens.
- Cloudinary-backed blog image uploads through the backend.

## Tech Stack

Frontend:

- Next.js 16
- React 19
- Tailwind CSS
- TipTap rich text editor
- Font Awesome icons
- shadcn/Radix UI dependencies

Backend:

- Node.js
- Express.js
- MongoDB and Mongoose
- JWT authentication
- Multer and Cloudinary
- bcryptjs

## Folder Structure

```text
BlogCMS-Frontend
├── components
│   ├── Buttons
│   ├── Card
│   ├── Header
│   ├── Footer
│   └── admin
├── public
│   └── assets
├── src
│   ├── app
│   │   ├── admin
│   │   ├── auth
│   │   ├── user
│   │   └── api
│   └── utils
│       ├── auth
│       ├── blog
│       ├── category
│       └── profile
├── package.json
└── next.config.mjs
```

## Full Project Setup

Use two terminals: one for backend and one for frontend.

## Backend Setup

Go to the backend:

```bash
cd d:\BLOG\blog-cms
```

Install dependencies:

```bash
npm install
```

Create `.env` from the example:

```bash
copy .env.example .env
```

Backend `.env`:

```env
PORT=8000
MONGODB_URI=mongodb://127.0.0.1:27017/blog-cms
JWT_SECRET=replace-with-a-long-random-secret
CLOUD_NAME=your-cloudinary-cloud-name
API_KEY=your-cloudinary-api-key
API_SECRET=your-cloudinary-api-secret
```

For MongoDB Atlas:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster-name.mongodb.net/blog-cms
```

Start backend:

```bash
npm start
```

Backend URL:

```text
http://localhost:8000
```

## Frontend Setup

Go to the frontend:

```bash
cd d:\BLOG\BlogCMS-Frontend
```

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:8000
```

Start frontend:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## API Summary

Backend routes are prefixed with `/api`.

### Auth

| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get logged-in user profile |

### Blogs

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/blogs` | Get published blogs |
| GET | `/api/blogs/mine` | Get current user's blogs and drafts |
| GET | `/api/blogs/:id` | Get blog by ID or slug |
| POST | `/api/blogs` | Create blog |
| PUT | `/api/blogs/:id` | Update blog |
| DELETE | `/api/blogs/:id` | Soft delete blog |
| GET | `/api/blogs/:id/comments` | Get blog comments |
| POST | `/api/blogs/:id/comments` | Add comment |
| DELETE | `/api/blogs/:id/comments/:commentId` | Delete comment |
| POST | `/api/blogs/:id/likes` | Toggle like |

Blog filters:

```text
/api/blogs?search=react&category=Technology&tag=nextjs&page=1&limit=10
```

### Categories

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/categories` | Get categories |
| POST | `/api/categories` | Create category |
| DELETE | `/api/categories/:id` | Delete category |

## Frontend Pages

| Route | Description |
| --- | --- |
| `/user` | Browse and discover published blogs |
| `/user/[slug]` | Read a blog, like it, and comment |
| `/user/createBlog` | Create a blog or save draft |
| `/user/viewBlog` | Manage current user's blogs |
| `/auth/login` | Login |
| `/auth/register` | Register |
| `/admin/dashboard` | Admin dashboard |
| `/admin/posts` | Admin posts |
| `/admin/settings` | Admin settings |

## Important Frontend Files

```text
src/utils/auth/helper.js
src/utils/blog/helper.js
src/utils/category/helper.js
components/Card/CreateBlogForm.jsx
components/Card/BlogCard.jsx
components/Card/BlogDetail.jsx
components/Buttons/SearchFilter.jsx
```

## Blog Create Form Fields

The frontend sends blog create/update requests as `multipart/form-data`.

Fields:

```text
title
slug
content
category
tags
isPublic
image
```

Use:

- `isPublic=true` to publish.
- `isPublic=false` to save as draft.

## Scripts

Frontend:

```bash
npm run dev
npm run build
npm start
npm run lint
```

Backend:

```bash
npm start
```

## Validation

Build frontend:

```bash
cd d:\BLOG\BlogCMS-Frontend
npm run build
```

Check backend syntax:

```bash
cd d:\BLOG\blog-cms
node --check server.js
```

Note: `npm run lint` currently needs an ESLint 9 flat config file, such as `eslint.config.js`.

## Troubleshooting

If images do not upload:

- Check Cloudinary env variables in `blog-cms/.env`.
- Confirm image is JPEG, PNG, or WEBP.
- Confirm image size is below 5 MB.

If blogs do not load:

- Start backend first.
- Check `NEXT_PUBLIC_BASE_URL=http://localhost:8000`.
- Restart frontend after changing `.env.local`.

If login-protected actions fail:

- Login again.
- Check that the browser has a `token` cookie.
- Confirm backend `JWT_SECRET` is set.

If MongoDB does not connect:

- Check `MONGODB_URI`.
- Start local MongoDB or configure MongoDB Atlas network access.

