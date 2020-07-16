module.exports = function(sequelize, DataTypes) {

    // Add code here to create a Post model
    // This model needs a title, a body, and a category
    // Don't forget to 'return' the post after defining
    const Votes= sequelize.define('votes', {
      user_id: {
        type: DataTypes.STRING,
        allowNull: false
      },
      post_content: {
        type:  DataTypes.TEXT 
      },
      date_time: {
        type:  DataTypes.TIME
      }

    }, {
  
      freezeTableName: true
  
    })
    return Votes
};