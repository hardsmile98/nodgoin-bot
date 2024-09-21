import { type Context } from 'telegraf'
import { UserRepository } from '../../db'
import type UserEntity from '../../db/entity/user.entity'

const downloadAvatar = async (ctx: Context, user: UserEntity) => {
  user.image = `https://root.kkxlabs.com/nodgoin/users/photo/user_${user.telegram_id}.png`

  await UserRepository.save(user)
}

export default downloadAvatar
