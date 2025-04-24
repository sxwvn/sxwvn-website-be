import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import Express from 'express'
import mime from 'mime-types'
import dotenv from 'dotenv'

dotenv.config()

// Make router that the main app will listen for
const router = new Express.Router()

// Set up AWS Credentials
const s3Client = new S3Client({
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
  }
})

// Route to stream video
router.get('/video/:filename', async (req, res) => {
  const { filename } = req.params

  try {
    const command = new GetObjectCommand({
      Bucket: 'sxwvn-artifacts',
      Key: `videos/${filename}`
    })

    const { Body, ContentType, ContentLength } = await s3Client.send(command)
    const mimeType = mime.lookup(filename) || 'application/octet-stream'

    res.writeHead(200, {
      'Content-Type': mimeType,
      'Content-Length': ContentLength
    })

    Body.pipe(res)
  } catch (err) {
    console.error('Error streaming video:', err)
    res.status(500).send('Failed to stream video')
  }
})

// By default export router, can call it whatever you want on the other side
export default router
