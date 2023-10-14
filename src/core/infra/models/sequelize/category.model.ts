import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript"

type CategoryModelProps = {
    categoryId: string;
    name: string;
    description: string | null
    isActive: boolean;
    createdAt: Date 
}

@Table({tableName: 'categories', timestamps: false})
export default class CategoryModel extends Model<CategoryModelProps> {
    @PrimaryKey
    @Column({ type: DataType.UUID, field: 'category_id'})
    declare categoryId: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    declare name: string;

    @Column({ allowNull: true, type: DataType.TEXT })
    declare description: string | null;

    @Column({ allowNull: false, type: DataType.BOOLEAN, field: 'is_active' })
    declare isActive: boolean;
    
    @Column({ allowNull: false, type: DataType.DATE(3), field: 'created_at' })
    declare createdAt: Date;
}