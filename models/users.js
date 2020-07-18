const bcrypt = require("bcrypt");

module.exports = function (sequelize, DataTypes) {
  // Add code here to create a Post model
  // This model needs a title, a body, and a category
  // Don't forget to 'return' the post after defining

  const Users = sequelize.define(
    "users",
    {
      user_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },

      user_firstName: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          len: [2, 20],
        },
      },

      user_lastName: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          len: [2, 20],
        },
      },

      user_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [2, 20],
        },
        unique: {
          args: true,
          msg: "That username is already taken!",
        },
      },

      user_email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
        unique: {
          args: true,
          msg: "Email is already in use!",
        },
      },

      user_birthday: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },

      user_bio: {
        type: DataTypes.STRING,
        validate: {
          len: [0, 200],
        },
      },

      user_password: {
        type: DataTypes.STRING,
        set(value) {
          const foo = this.setDataValue('user_password', bcrypt.hashSync(value, 10))
        }
      },
    },
    {
      freezeTableName: true
    }
  );

  // Users.associate = function(models) {
  //     Users.hasMany(models.comments, {foreignKey: "comment_id"})
  //     Users.hasMany(models.posts,  {foreignKey: "post_id"})
  // }
  return Users;
};
