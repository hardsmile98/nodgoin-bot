import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

export enum RefType {
  INITIAL = 'initial',
  LEVEL1 = 'level1',
  LEVEL2 = 'level2',
}

@Entity('users')
class UserEntity {
  @PrimaryGeneratedColumn('uuid')
    id: string

  @Column({ length: 128, nullable: true })
    first_name: string

  @Column({ length: 128, nullable: true })
    username: string

  @Column({ length: 128, nullable: true })
    last_name: string

  @Index({ unique: true })
  @Column({ type: 'bigint', default: 0, unique: true })
    telegram_id: number

  @Column({ default: false })
    is_premium: boolean

  @Column({ default: 0 })
    balance: number

  @Column({ default: 500, type: 'float' })
    energy: number

  @Column({ default: 0 })
    multi_tap_lvl: number

  @Column({ default: 0 })
    regeneration_speed_lvl: number

  @Column({ default: 0 })
    energy_limit_lvl: number

  @Column({ default: false })
    tip_top_bot: boolean

  @Column({ nullable: true })
    tip_tip_bot_award_date: Date

  @Column({ default: 2 })
    full_energy_boost: number

  @Column({ default: 2 })
    turbo: number

  @Column({ nullable: true })
    turbo_date: Date

  @Column({ default: false })
    turbo_active: boolean

  @Column({ default: 0 })
    turbo_bonus: number

  @Column({ nullable: true })
    turbo_free_date: Date

  @Column({ default: new Date() })
    last_visit: Date

  @Column({ default: new Date() })
    boosts_restored: Date

  @Column({ default: 0 })
    number_of_tickets_purchased: number

  @Column({ type: 'uuid', nullable: true })
    invited: string

  @Column({ type: 'uuid', nullable: true })
    squad_id: string

  @Column({ type: 'decimal', nullable: true })
    reg_date: string

  @Column({ length: 250, nullable: true })
    image: string

  @Column({ default: 0 })
    tickets: number

  @Column({ default: 0 })
    daily_strick_days: number

  @Column({ nullable: true })
    daily_reward_date: Date

  @Column({
    type: 'enum',
    enum: RefType,
    default: RefType.INITIAL
  })
    ref_type: RefType
}

export default UserEntity
