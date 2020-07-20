module.exports = function (sequelize, DataTypes) {
  // Add code here to create a Post model
  // This model needs a title, a body, and a category
  // Don't forget to 'return' the post after defining
  const Posts = sequelize.define(
    "posts",
    {
      post_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },

      post_content: {
        type: DataTypes.TEXT,
      },
      /*date_time: {
        type: DataTypes.TIME,
      },*/
    },
    {
      freezeTableName: true,
    }
  );

  Posts.associate = function (models) {
    Posts.hasMany(models.comments, {
      foreignKey: { name: "post_id" },
    });

    Posts.belongsTo(models.users, {
      foreignKey: {
        name: "user_id",
      },
      onDelete: "cascade",
    });
  };
  return Posts;
};
