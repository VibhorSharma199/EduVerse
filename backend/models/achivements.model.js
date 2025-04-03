const AchievementSchema = new Schema(
  {
    name: String,
    description: String,
    pointsRequired: Number,
    badge: { type: Schema.Types.ObjectId, ref: "Badge" },
  },
  { timestamps: true }
);
