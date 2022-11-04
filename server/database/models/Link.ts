import { sequelize } from '../'
import Sequelize from 'sequelize'

export interface LinkModel {
  id: number
  owner: number
  customUrl?: string
  value: string
}

class Link extends Sequelize.Model<LinkModel, Omit<LinkModel, 'id'>> {}
Link.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    owner: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    customUrl: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true,
    },
    value: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Links',
  },
)

export {
  Link,
}
