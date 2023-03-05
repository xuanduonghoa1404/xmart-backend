const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");

const options = {
  separator: "-",
  lang: "en",
  truncate: 120,
};

mongoose.plugin(slug, options);
const typeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    slug: "name",
    unique: true,
  },
  description: {
    type: String,
    required: false,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
  photo: {
    type: String,
    required: false,
  },
});
typeSchema.set("timestamps", true);
module.exports = mongoose.model("Type", typeSchema);
