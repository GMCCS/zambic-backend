const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 25
    },
    subtitle: { type: String },

    description: {
      type: String,
      required: true,
      minlength: 20,
      maxlength: 3000
    },
    continent: {
      type: String,
      required: true,
      enum: [
        "Africa",
        "Asia",
        "Europe",
        "South America",
        "North America",
        "Oceania",
        "Other"
      ]
    },
    updated: Date,
    photo: { data: Buffer, contentType: String }, // contains image DATA and the type of content (jpeg,png,etc...)

    // builds the relationship of post with volunteer
    owner: {
      type: ObjectId,
      ref: "Volunteer"
    },
    createdAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Post", postSchema);
