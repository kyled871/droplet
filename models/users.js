module.exports = function(sequelize, DataTypes) {

    // Add code here to create a Post model
    // This model needs a title, a body, and a category
    // Don't forget to 'return' the post after defining
    const Users = sequelize.define('users', {

        user_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID
        },

        user_firstName: {
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                len: [2,20]
            }

        },

        user_lastName: {
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                len: [2,20]
            }

        },

        user_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [2, 20],
                unique: true
            }
        },

        user_birthday: {
            type:  DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                isDate: true
            }
        },

        user_bio: {
            type: DataTypes.STRING,
            validate: {
                len: [0, 200]
            }
        },

        user_password: {
            type:  DataTypes.STRING,
            validate: {
                // must have at least 6 characters no more than 16
                // must have capital and numbers
                is: /^(?=.*\d)(?=.*[A-Z])(?!.*[^a-zA-Z0-9@#$^+=])(.{8,16})$/
                // must not be ['password', 'username', etc...]
            }
        }

    }, {
  
      freezeTableName: true,
    //   instanceMethods: {
    //       generateHash(user_password) {
    //           return bcrypt.hash(user_password, bcrypt.genSaltSync(8));
    //       },

    //       validatePassword(user_password) {
    //           return bcrypt.compare(user_password, this.user_password)
    //       }
    //   },
      hooks: {
          beforeCreate: function(user) {

            user.user_firstName.toLowerCase().replace(/\b[a-z]/g, function(txtVal) {
                return txtVal.toUpperCase();
            });

            user.user_lastName.toLowerCase().replace(/\b[a-z]/g, function(txtVal) {
                return txtVal.toUpperCase();
            });
            return user
          }
          
    }
    
  
    })
    return Users
};