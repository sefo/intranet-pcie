module.exports = function(sequelize, DataTypes) {
	var Utilisateur = sequelize.define("Utilisateur", {
		id : {
			type : DataTypes.INTEGER,
			primaryKey: true,
			allowNull : false,
		},
		nom : {
			type : DataTypes.STRING,
			allowNull : false,
		},
		prenom : {
			type : DataTypes.STRING,
			allowNull : false,
		},
		hash : {
			type : DataTypes.STRING,
			allowNull : false,
		},
		email : {
			type : DataTypes.STRING,
			allowNull : false,
		},
		role : {
			type : DataTypes.INTEGER,
			allowNull : false,
		}
	}, {
		tableName: 'utilisateur',
		timestamps: false,
		classMethods: {
			associate: function(models) {
				//targetKey optionnel, defaut = PK de la table
				//as est obligatoire si dans findAll du controller on utilise as
				Utilisateur.belongsTo(models.Role, { foreignKey: 'role', targetKey: 'id', as: 'role_utilisateur' } );
			}
		}
	});
	return Utilisateur;
};