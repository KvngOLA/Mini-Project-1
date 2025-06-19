const postModel = require("../model/post.model");

class PostService {
  static findMany() {
    return postModel.find({});
  }
  static async estimatedDocumentCount() {
    return postModel.estimatedDocumentCount();
  }

  static async findOne(title) {
    return postModel.findOne({ title });
  }
  static async create(data) {
    return postModel.create(data);
  }
  static async update(title, data) {
    return postModel.findOneAndUpdate({ title }, data, { new: true });
  }
}

module.exports = PostService;
