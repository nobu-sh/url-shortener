import { sequelize } from '../'
import Sequelize from 'sequelize'

export interface InviteModel {
  id: number
  creator: number
  value: string
  used: boolean
}

class Invite extends Sequelize.Model<InviteModel, Omit<InviteModel, 'id'>> {}
Invite.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    creator: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    value: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    used: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Invites',
  },
)

export {
  Invite,
}
