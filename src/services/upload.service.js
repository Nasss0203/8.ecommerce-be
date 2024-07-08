const cloudinary = require('../configs/cloudinary.config')

// const uploadImageFromUrl = async () => {
//     try {
//         const urlImage = 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd5h-lu93mv55wmphdb'
//         const folderName = 'product/shopId', newFileName = 'testdemo'

//         const result = await cloudinary.uploader.upload(urlImage, {
//             // public_id: newFileName,
//             folder: folderName
//         })
//         console.log('result: ', result);
//         return result
//     } catch (error) {
//         console.error(error);
//     }
// }

const uploadImageFromLocal = async ({ path, folderName = 'product', }) => {
    try {
        const result = await cloudinary.uploader.upload(path, {
            folder: folderName
        })
        return {
            image_url: result.secure_url,
            shopId: 8409,
            thumb_url: await cloudinary.url(result.public_id, {
                height: 600,
                width: 600,
                format: 'jpg'
            })
        }
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    uploadImageFromLocal,
    // uploadImageFromUrl
}
