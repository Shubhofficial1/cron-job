import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    trim: true,
  },
  courseId: {
    type: Number,
    required: true,
    trim: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
});

subscriptionSchema.statics.createSubscription = async function (
  userId,
  courseId,
  expirationDate
) {
  const subscription = new this({
    userId,
    courseId,
    expirationDate,
  });
  await subscription.save();
  return subscription;
};

subscriptionSchema.statics.getSubscriptionByUserIdAndCourseId = function (
  userId,
  courseId
) {
  return this.findOne({ userId, courseId });
};

subscriptionSchema.statics.deleteSubscriptionById = function (subscriptionId) {
  return this.findByIdAndDelete(subscriptionId);
};

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
