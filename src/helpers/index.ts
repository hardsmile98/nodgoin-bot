import axios from 'axios'
import fs from 'fs'

const downloadImage = async (url: string, path: string) =>
  await axios({
    url,
    responseType: 'stream'
  }).then(
    async response =>
      await new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(path))
          .on('finish', () => { resolve('finish') })
          .on('error', e => { reject(e) })
      })
  )

export {
  downloadImage
}
