import {
  User, Link, Invite, 
} from './models'

/* NOTE: THIS WILL DROP THE CURRENT DATABASE */
async function seed() {
  await User.sync({ force: true })
  await Link.sync({ force: true })
  await Invite.sync({ force: true })
}

seed()
  .then(() => console.log('Forcefully database and dropped existing DAOs.'))
  .catch(console.error)
