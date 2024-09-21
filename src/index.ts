import 'dotenv/config'
import 'reflect-metadata'

import { Telegraf } from 'telegraf'
import { AppDataSource } from './db'
import { start } from './commands'

const BOT_TOKEN = process.env.BOT_TOKEN ?? ''

const bot = new Telegraf(BOT_TOKEN)

bot.command('start', start())

const bootstap = async () => {
  try {
    await AppDataSource.initialize()

    bot.launch()

    console.log('Bot is started')
  } catch (e) {
    console.log(`Error in bootstap: ${e.message}`)
  }
}

bootstap()
