const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../sequelize");
class Picture extends Model {}

Picture.init(
	{
		id: {
			type: DataTypes.STRING(50),
			primaryKey: true,
		},
		path: DataTypes.STRING(50),
		userId: DataTypes.STRING(50),
		galleryId: DataTypes.STRING(50),
		desc: DataTypes.STRING(255),
		crtTime: DataTypes.TIME,
	},
	{
		modelName: "picture",
		sequelize,
	}
);
