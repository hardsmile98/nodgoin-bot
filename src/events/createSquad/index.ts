import { type Context } from 'telegraf'
import { SquadRepository, UserRepository } from '../../db'
import path from 'path'
import { downloadImage } from '../../helpers'

const isDev = process.env.MODE === 'dev'

const createSquad = () => async (ctx: Context) => {
  if (ctx.has('my_chat_member')) {
    if (ctx.update.my_chat_member.new_chat_member.user.id === ctx.botInfo.id) {
      if (ctx.update.my_chat_member.new_chat_member.status === 'administrator') {
        try {
          const user = await UserRepository.findOneBy({ telegram_id: ctx.from.id })

          if (!user) {
            return
          }

          const userSquad = await SquadRepository.findOneBy({ owner: user.id })

          if (userSquad) {
            return await ctx.telegram.sendMessage(user.telegram_id, '🛑 You can create no more than 1 squad')
          }

          const chatId = ctx.update.my_chat_member.chat.id

          const squadFinded = await SquadRepository.findOneBy({ chat_id: chatId.toString() })

          if (squadFinded) {
            return
          }

          const chatInfo = await ctx.telegram.getChat(chatId)

          const username = chatInfo.type !== 'group' ? chatInfo.username : undefined

          if (chatInfo.photo) {
            const url = await ctx.telegram.getFileLink(chatInfo.photo.small_file_id)

            const pathOnServer = isDev
              ? path.resolve(__dirname, '../../../images', `${chatId.toString()}.png`)
              : `/var/www/nodgoin_data/chat_photos/chat_${chatId}.png`

            await downloadImage(url.href, pathOnServer)
          }

          const name = chatInfo.type === 'private' ? `Сквад #${ctx.from.id}` : chatInfo.title

          const newSquad = SquadRepository.create({
            name,
            username,
            chat_id: chatId.toString(),
            image: `https://root.kkxlabs.com/nodgoin/chats/photo/chat_${chatId.toString()}.png`,
            owner: user.id
          })

          const suqadCreated = await SquadRepository.save(newSquad)

          user.squad_id = suqadCreated.id

          await UserRepository.save(user)
        } catch (e) {
          console.log(`Error in createSquad: ${e.message}`)
        }
      }
    }
  }
}

export default createSquad
