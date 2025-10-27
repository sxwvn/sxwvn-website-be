import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import Express from 'express'
import mime from 'mime-types'
import dotenv from 'dotenv'
import crypto from 'crypto'

dotenv.config()

// For auth
let currentToken = null
let expiryTime = null
let random = 0
const element = ["Dream Big, Fart Loud", "Listen to your intrusive thoughts", "Mew mew mew mew mew mew mew mew mew", 
  "I'm pure data, 0110, no fun without me >:)", "I am inside your firewall", "You can't stop me."]

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

// Auth helper
function generateToken() {
  currentToken = crypto.randomBytes(16).toString('hex')
  expiryTime = new Date(Date.now() + 5 * 60 * 1000) // 5 mins from now
  random = Math.floor(Math.random() * element.length)
  console.log(`New token generated: ${currentToken} (expires at ${expiryTime}, with broadcast ${element[random]})`)
}

generateToken()
setInterval(generateToken, 5 * 60 * 1000)

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

// Route to stream audio
router.get('/audio/:filename', async (req, res) => {
  const { filename } = req.params

  try {
    const command = new GetObjectCommand({
      Bucket: 'sxwvn-artifacts',
      Key: `music/${filename}`
    })

    const { Body, ContentType, ContentLength } = await s3Client.send(command)
    const mimeType = mime.lookup(filename) || 'application/octet-stream'

    res.writeHead(200, {
      'Content-Type': mimeType,
      'Content-Length': ContentLength
    })

    Body.pipe(res)
  } catch (err) {
    console.error('Error streaming audio:', err)
    res.status(500).send('Failed to stream audio')
  }
})

router.get('/Y2hpY2tlbi1sYWR5/dG9rZW56', (req, res) => {
  if (!currentToken || new Date() > expiryTime) {
    generateToken();
  }

  res.json({
    ID: currentToken,
    Broadcast:element[random],
    Expiry: expiryTime
  })
})

router.post('/Y2hpY2tlbi1sYWR5/dG9rZW56', (req, res) => {
  const { Token } = req.body;

  if (!Token) {
    return res.status(400).json({ error: 'Perhaps you are missing something...' })
  }

  if (Token !== currentToken) {
    return res.status(401).json({ success: false, reason: 'Not what Im looking for :/' })
  }

  if (new Date() > expiryTime) {
    return res.status(401).json({ success: false, reason: 'Wait for my next broadcast. Ring, ring.' })
  }

  res.json({ success: true, message: process.env.TEXT_KEY })
})

// By default export router, can call it whatever you want on the other side
export default router
