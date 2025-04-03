const BadgeSchema = new Schema(
  {
    name: String,
    description: String,
    image: String,
    criteria: String,
  },
  { timestamps: true }
);
