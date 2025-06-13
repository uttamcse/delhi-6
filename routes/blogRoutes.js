const { createRouter } = require("../utils/routerHelper");
const HttpMethods = require("../utils/httpMethods");
const {
   blogImageUpload,
  uploadblogImage,
  getBlogImages,
  deleteBlogImage,
  getBlogById,
  commentOnBlog,
  updateBlogImage,
} = require("../controllers/blogController");

const routes = [
  {
    method: HttpMethods.POST,
    path: "/blog",
    handlers: [blogImageUpload, uploadblogImage],
  },
  {
    method: HttpMethods.GET,
    path: "/blog",
    handlers: [getBlogImages],
  },
  {
    method: HttpMethods.DELETE,
    path: "/blog/:id",
    handlers: [deleteBlogImage],
  },
  {
    method: HttpMethods.PUT,
    path: "/blog/:id",
    handlers: [blogImageUpload, updateBlogImage],
  },
  {
    method: HttpMethods.GET,
    path: "/blog/:id",
    handlers: [getBlogById],
  },
 {
    method: HttpMethods.PUT,
    path: "/customers/:blogId/comment",
    handlers: [ commentOnBlog],
  },

];

const router = createRouter(routes);

module.exports = router;