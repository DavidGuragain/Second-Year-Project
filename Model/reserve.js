module.exports = (sequelize, DataTypes) => {
    const Reserve = sequelize.define("reserve", {
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        SelectVehicles: {
            type: DataTypes.STRING,
            allowNull: false
        },
        PrefferedDate: {
            type: DataTypes.STRING,
            allowNull: false
        },
        FullName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Contact: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Message: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    });
    return Reserve;
};
