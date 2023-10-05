import { Sequelize } from 'sequelize'

// Creación de la instancia de Sequelize
const db = new Sequelize(
    'hrhoyhay', // DB name
    'hrhoyhay', // User
    'U0jQ25dPtqwSBkQoaMIFtOHhZEV1w-73', // Password
    {
  host: 'silly.db.elephantsql.com',
  dialect: 'postgres',
  logging: true
})

export default db

