module.exports = function(sequelize, DataTypes) {
	var Role = sequelize.define("Role", {
		id : {
			type : DataTypes.INTEGER,
			primaryKey: true,
			allowNull : false,
		},
		intitule : {
			type : DataTypes.STRING,
			allowNull : false,
		}
	}, {
		tableName: 'role',
		timestamps: false,
		classMethods: {
			associate: function(models) {
				Role.hasMany(models.Utilisateur, { foreignKey: 'role' });
			}
		}
	});
	return Role;
};