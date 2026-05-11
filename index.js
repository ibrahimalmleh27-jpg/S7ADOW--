const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const cors = require('cors')

const app = express()

const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.static(__dirname))

// إنشاء مجلد الرفع
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads')
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, unique + path.extname(file.originalname))
    }
})

const upload = multer({ storage })

// رفع الملفات
app.post('/upload', upload.single('file'), (req, res) => {

    if (!req.file) {
        return res.json({
            status: false,
            message: 'No file uploaded'
        })
    }

    const fileUrl =
        `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`

    res.json({
        status: true,
        creator: "S7ADOWS",
        file: fileUrl
    })

})

// الصفحة الرئيسية
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(PORT, () => {
    console.log(`S7ADOWS running on port ${PORT}`)
})
