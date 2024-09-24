import { DataSource } from 'typeorm'
import UserEntity from './entity/user.entity'
import ReferralsEntity from './entity/referrals.entity'
import SquadEntity from './entity/squad.entity'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? +process.env.DB_PORT : 5431,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  entities: [UserEntity, ReferralsEntity, SquadEntity],
  subscribers: [],
  migrations: []
})

export const UserRepository = AppDataSource.getRepository(UserEntity)
export const ReferralsRepository = AppDataSource.getRepository(ReferralsEntity)
export const SquadRepository = AppDataSource.getRepository(SquadEntity)
