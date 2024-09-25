import { type Context } from 'telegraf'
import { UserRepository } from '../../db'
import type UserEntity from '../../db/entity/user.entity'
import { downloadImage } from '../../helpers'
import path from 'path'

const isDev = process.env.MODE === 'dev'

const downloadAvatar = async (ctx: Context, user: UserEntity) => {
  try {
    const photos = await ctx.telegram.getUserProfilePhotos(user.telegram_id)

    const fileId = photos?.photos?.[0]?.[0]?.file_id

    if (!photos || photos?.total_count === 0 || !fileId) {
      user.image = `https://robohash.org/${user.telegram_id}?size=200x200&set=2`

      await UserRepository.save(user)

      return
    }

    const url = await ctx.telegram.getFileLink(fileId)

    const pathOnServer = isDev
      ? path.resolve(__dirname, '../../../images', `${user.telegram_id}.png`)
      : `/var/www/nodgoin_data/user_photos/user_${user.telegram_id}.png`

    await downloadImage(url.href, pathOnServer)

    user.image = `https://root.kkxlabs.com/nodgoin/users/photo/user_${user.telegram_id}.png`

    await UserRepository.save(user)
  } catch (e) {
    console.log(`Error in downloadAvatar: ${e.message}`)
  }
}

export default downloadAvatar
