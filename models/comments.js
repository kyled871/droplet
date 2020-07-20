module.exports = function (sequelize, DataTypes) {
  // Add code here to create a Post model
  // This model needs a title, a body, and a category
  // Don't forget to 'return' the post after defining
  const Comments = sequelize.define(
    "comments",
    {
      comment_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      comment_content: {
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

  Comments.associate = function (models) {
    Comments.belongsTo(models.posts, {
      foreignKey: { name: "post_id" },
      onDelete: "cascade",
    });

    Comments.belongsTo(models.users, {
      foreignKey: { name: "user_id" },
      onDelete: "cascade",
    })
  };

  return Comments;
};
