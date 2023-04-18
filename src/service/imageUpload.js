import s3 from "../config/s3.config.js"

export const s3FileUpload = async({bucketName, key, body, contentType}) => {
    return await s3.upload({
        bucket: bucketName,
        key: key,
        Body: body,
        ContentType: contentType
    })
    .promise()
}

export const s3deleteFile = async ({bucketName, key}) => {
    return await s3.deleteObject({
        bucket: bucketName,
        key: key
    })
    .promise()
}