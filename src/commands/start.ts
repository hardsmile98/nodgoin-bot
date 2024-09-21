import { type Context } from 'telegraf'

const start = () => async (ctx: Context) => {
  return await ctx.reply('started')
}

export default start
