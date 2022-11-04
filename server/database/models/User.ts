import { sequelize } from '../'
import Sequelize from 'sequelize'

export interface UserModel {
  id: number
  username: string
  /**
   * INIT - First account created. Has full control.
   * ADMIN - Able to create invites/manage shortened links.
   * USER - Allowed to create shortened links.
   */
  role: 'INIT' | 'ADMIN' | 'USER'
  password: string
}

class User extends Sequelize.Model<UserModel, Omit<UserModel, 'id'>> {}
User.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    role: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'USER',
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Users',
  },
)

export {
  User,
}
