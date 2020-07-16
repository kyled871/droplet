module.exports = function(sequelize, DataTypes) {

    // Add code here to create a Post model
    // This model needs a title, a body, and a category
    // Don't forget to 'return' the post after defining
    const Posts= sequelize.define('posts', {
      user_id: {
        type: DataTypes.UUID
      },

      post_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
      },

      post_content: {
        type: DataTypes.TEXT,
      },
      date_time: {
        type: DataTypes.TIME
      }
    }, {
  
      freezeTableName: true
  
    })

    // Posts.associate = function(models) {

    //   Posts.hasMany(models.comments, {
    //     foreignKey: "comment_id"
    //   });

    //   Posts.belongsTo(models.users, {
    //     foreignKey: "user_id"
    //   })
    // }
    return Posts
};