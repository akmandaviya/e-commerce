import { v2 as cloudinary } from 'cloudinary' 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_SECRET_API_KEY
})

const uploadAvatar = async(img) => { 
  // converting to image to buffer, if in buffe then use diretly
  const buffer = img?.buffer || Buffer.from(await img.arrayBuffer())  
  const uploadImg = await new Promise((resolve, reject) => { 
    cloudinary.uploader.upload_stream({ folder: 'onecart'}, (error, uploadResult) => { 
      return resolve(uploadResult)
    }).end(buffer)
  })

  return uploadImg
}

export default uploadAvatar