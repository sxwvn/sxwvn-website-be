import Express from 'express'
import DataRouter from './routers/routes.js'
import dotenv from 'dotenv'

dotenv.config()

// Create an Express application
const app = new Express()

// Attach data router, include 'data' before the endpoint name
app.use('/api', DataRouter)

// Static Files
app.use(Express.static('public'))

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
