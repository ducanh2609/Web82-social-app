import CommentModel from "../../models/comment/index.js";
import PostModel from "../../models/post/index.js";

const commentController = {
    getCommentByListPostId: async (req, res) => {
        try {
            // pass query listPostId type string
            // ex: listPostId: 65351c47f991d10b413ab480,6534dc9e4d54871cc6ad3e4c,653539bc2662dda8ab033d72
            const { listPostId, limitComment } = req.query;
            if (!listPostId) throw new Error('Bạn cần cung cấp thông tin của các bài post!');
            const allComment = await CommentModel.find({
                post: {
                    $in: listPostId.split(',')
                }
            }).sort({
                createdAt: -1
            }).limit(limitComment || 3);
            res.status(200).send({
                data: allComment,
                message: 'Thành công!',
                success: true,
            });
        } catch (error) {
            res.status(403).send({
                data: null,
                message: error.message,
                success: false,
                error
            });
        }
    },
    createComment: async (req, res) => {
        try {
            const { postId, contentComment } = req.body;
            if (!postId) throw new Error('Không có thông tin bài post');
            if (!contentComment) throw new Error('Không có nội dung bình luận!');
            const user = req.user;
            const currentPost = await PostModel.findById(postId);
            if (!currentPost) throw new Error('Không có thông tin bài post');

            const createdComment = await CommentModel.create({
                post: postId,
                content: contentComment,
                author: user.userId
            });
            res.status(201).send({
                data: createdComment,
                message: 'Thành công!',
                success: true,
            });
        } catch (error) {
            res.status(403).send({
                data: null,
                message: error.message,
                success: false,
                error
            });
        }
    },
    deleteCommentById: async (req, res) => {
        try {
            const user = req.user;
            const { id } = req.params;
            const currentComment = await CommentModel.findById(id).populate('post');
            if (!currentComment) throw new Error('Không tìm thấy bình luận!');
            // kiểm tra nếu là chủ bài viết muốn xoá comment hoặc nếu là chủ comment muốn xoá comment
            if (user.userId === currentComment.post.author.toString() || user.userId === currentComment.author.toString()) {
                currentComment.deleteOne();
            } else {
                throw new Error('Không thể xoá bình luận!');
            }
            res.status(201).send({
                data: currentComment,
                message: 'Thành công!',
                success: true,
            });
        } catch (error) {
            res.status(403).send({
                data: null,
                message: error.message,
                success: false,
                error
            });
        }
    },
    findByIdAndUpdate: async (req, res) => {
        try {
            const { id } = req.params;
            const { content } = req.body;

            const currentComment = await CommentModel.findByIdAndUpdate(id, { content });
            if (!currentComment) throw new Error('Không tìm thấy bình luận!');
            res.status(201).send({
                data: currentComment,
                message: 'Thành công!',
                success: true,
            });
        } catch (error) {
            res.status(403).send({
                data: null,
                message: error.message,
                success: false,
                error
            });
        }
    }
}
export default commentController;