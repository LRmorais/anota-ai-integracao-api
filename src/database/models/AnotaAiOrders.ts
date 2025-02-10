import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database';

interface AnotaAiOrdersAttributes {
    id: number;
    store_id: string;
    company_id: number;
    anota_ai_order_id?: string;
    check_status?: number;
    order_id?: number;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

interface AnotaAiOrdersCreationAttributes extends Optional<AnotaAiOrdersAttributes, 'id' | 'anota_ai_order_id' | 'check_status' | 'order_id' | 'created_at' | 'updated_at' | 'deleted_at'> {}

class AnotaAiOrders
    extends Model<AnotaAiOrdersAttributes, AnotaAiOrdersCreationAttributes>
    implements AnotaAiOrdersAttributes
{
    public id!: number;
    public store_id!: string;
    public company_id!: number;
    public anota_ai_order_id?: string;
    public check_status?: number;
    public order_id?: number;
    public created_at?: Date;
    public updated_at?: Date;
    public deleted_at?: Date;
}

AnotaAiOrders.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        store_id: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        company_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        anota_ai_order_id: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        check_status: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        order_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'anota_ai_orders',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        paranoid: true,
        deletedAt: 'deleted_at',
    }
);

export default AnotaAiOrders;
