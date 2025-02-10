import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database';

interface CompanyAttributes {
    id: number;
    address_id: number;
    segment_id: number;
    company_status_id: number;
    representative_id: number;
    doc: string;
    fantasy_name: string;
    social_name: string;
    state_register: string;
    city_register: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
    price_table_id?: number;
    max_ifood_integrations?: number;
    max_simultaneous_deliveries?: number;
}

interface CompanyCreationAttributes extends Optional<CompanyAttributes, 'id' | 'deleted_at' | 'price_table_id' | 'max_ifood_integrations' | 'max_simultaneous_deliveries'> {}

class Company extends Model<CompanyAttributes, CompanyCreationAttributes> implements CompanyAttributes {
    public id!: number;
    public address_id!: number;
    public segment_id!: number;
    public company_status_id!: number;
    public representative_id!: number;
    public doc!: string;
    public fantasy_name!: string;
    public social_name!: string;
    public state_register!: string;
    public city_register!: string;
    public created_at!: Date;
    public updated_at!: Date;
    public deleted_at?: Date;
    public price_table_id?: number;
    public max_ifood_integrations?: number;
    public max_simultaneous_deliveries?: number;
}

Company.init(
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        address_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        segment_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        company_status_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        representative_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        doc: {
            type: DataTypes.STRING(14),
            allowNull: false,
        },
        fantasy_name: {
            type: DataTypes.STRING(191),
            allowNull: false,
        },
        social_name: {
            type: DataTypes.STRING(191),
            allowNull: false,
        },
        state_register: {
            type: DataTypes.STRING(9),
            allowNull: true,
        },
        city_register: {
            type: DataTypes.STRING(11),
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        price_table_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        max_ifood_integrations: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        max_simultaneous_deliveries: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        tableName: 'companies',
        timestamps: false,
    }
);

export default Company;
