const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  image: [
    {
      type: String,
    },
  ],
  imageBanner: [
    {
      type: String,
    },
  ],
  imageBannerSecondary: [
    {
      type: String,
    },
  ],
});
shopSchema.set('timestamps', true);
module.exports = mongoose.model('Shop', shopSchema);
