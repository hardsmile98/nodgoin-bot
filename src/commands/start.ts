import { type Context } from 'telegraf'
import { UserRepository } from '../db'

const start = () => async (ctx: Context) => {
  const user = await UserRepository.findOneBy({ telegram_id: ctx.from?.id })

  console.log(user)

  return await ctx.reply('started')
}

export default start
