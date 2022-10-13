import { Sequelize } from 'sequelize'
import { resolve } from 'path'
import { ProjectRootPath } from '../Constants'

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: resolve(ProjectRootPath, 'store.sqlite3'),
})

export {
  sequelize,
}
