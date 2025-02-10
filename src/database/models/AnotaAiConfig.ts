import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database';

interface AnotaAiConfigAttributes {
    id: number;
    company_id: number;
    integration_key?: string;
    store_name?: string;
    store_id?: string;
    access_token?: string;
    active?: boolean;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

interface AnotaAiConfigCreationAttributes
    extends Optional<
        AnotaAiConfigAttributes,
        'id' | 'integration_key' | 'store_name' | 'store_id' | 'access_token' | 'active' | 'created_at' | 'updated_at' | 'deleted_at'
    > {}

class AnotaAiConfig
    extends Model<AnotaAiConfigAttributes, AnotaAiConfigCreationAttributes>
    implements AnotaAiConfigAttributes
{
    public id!: number;
    public company_id!: number;
    public integration_key?: string;
    public store_name?: string;
    public store_id?: string;
    public access_token?: string;
    public active?: boolean;
    public created_at?: Date;
    public updated_at?: Date;
    public deleted_at?: Date;
}

AnotaAiConfig.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        company_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        integration_key: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        store_name: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        store_id: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        access_token: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
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
        tableName: 'anota_ai_config',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

export default AnotaAiConfig;
