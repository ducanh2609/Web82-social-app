import PostModel from "../../models/post/index.js";

const postController = {
    createPost: async (req, res) => {
        try {
            // get from verify token
            const user = req.user;
            const { content, images } = req.body;
            if (!content) throw new Error('Bạn chưa cung cấp nội dung!');
            const createPost = await PostModel.create({
                content,
                images,
                author: user.userId
            });
            res.status(201).send({
                data: createPost,
                message: 'Tạo bài viết thành công!',
                succes: true
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
    getAllPost: async (req, res) => {
        try {
            const { page, pageSize } = req.query;
            const totalItems = await PostModel.countDocuments({
                isDelete: false
            });
            const totalPages = Math.ceil(totalItems / Number(pageSize || 10));
            const skip = page ? (page - 1) * pageSize : 0;
            const result = await PostModel.find({ isDelete: false })
                .skip(skip)
                .limit(pageSize);

            const data = {
                totalItems,
                totalPages,
                currentPage: page,
                items: result,
            };
            res.status(200).send({
                data: data,
                message: 'Tạo bài viết thành công!',
                succes: true
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
    getPostById: async (req, res) => {
        try {
            const { id } = req.params;
            const post = await PostModel.findById(id);
            res.status(200).send({
                data: post,
                message: 'Thành công!',
                succes: true
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
    findPostByIdAndUpdate: async (req, res) => {
        try {
            const { content, images } = req.body;
            const user = req.user;
            const { id } = req.params;
            const currentPost = await PostModel.findOneAndUpdate({
                _id: id,
                author: user.userId
            }, {
                content,
                images
            });
            if (!currentPost) throw new Error('Không thể cập nhật bài đăng!');
            res.status(201).send({
                data: currentPost,
                message: 'Thành công!',
                succes: true
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
    findPostByIdAndDelete: async (req, res) => {
        try {
            const { id } = req.params;
            const user = req.user;
            const currentPost = await PostModel.findOneAndUpdate({
                _id: id,
                author: user.userId
            }, {
                isDelete: true
            });
             if (!currentPost) throw new Error('Không thể xoá bài đăng!');
            res.status(201).send({
                data: currentPost,
                message: 'Thành công!',
                succes: true
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
};

export default postController;