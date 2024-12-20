import { type Context } from 'telegraf'
import { message } from 'telegraf/filters'
import { UserRepository } from '../../db'
import type UserEntity from '../../db/entity/user.entity'
import checkRef from './checkRef'
import checkSquad from './checkSquad'
import downloadAvatar from './downloadAvatar'

const start = () => async (ctx: Context) => {
  try {
    if (ctx.has(message('text'))) {
      let user: UserEntity | null

      let isNewUser: boolean = false

      user = await UserRepository.findOneBy({ telegram_id: ctx.from.id })

      if (!user) {
        isNewUser = true

        const newUser = UserRepository.create({
          first_name: ctx.from.first_name,
          last_name: ctx.from.last_name,
          is_premium: ctx.from.is_premium,
          telegram_id: ctx.from.id,
          username: ctx.from.username,
          balance: 0,
          reg_date: new Date().getTime().toString()
        })

        user = await UserRepository.save(newUser)
      }

      if (!user.image) {
        downloadAvatar(ctx, user)
      }

      if ('payload' in ctx && typeof ctx.payload === 'string') {
        if (ctx.payload.includes('ref_') && isNewUser) {
          await checkRef(ctx.payload, user)
        }

        if (ctx.payload.includes('squad_')) {
          const squad = await checkSquad(ctx.payload, user)

          if (squad) {
            return await ctx.reply(`🚩 You have joined the squad ${squad.name}`, {
              reply_markup: {
                resize_keyboard: true,
                inline_keyboard: [
                  [{
                    text: 'Play',
                    web_app: {
                      url: process.env.APP_LINK ?? ''
                    }
                  }]
                ]
              }
            })
          }
        }
      }

      await ctx.reply('Welcome! Click on the button below to start the game.', {
        reply_markup: {
          resize_keyboard: true,
          inline_keyboard: [
            [{
              text: 'Play',
              web_app: {
                url: process.env.APP_LINK ?? ''
              }
            }]
          ]
        }
      })
    }
  } catch (e) {
    console.log(`Error in start: ${e.message}`)
  }
}

export default start
