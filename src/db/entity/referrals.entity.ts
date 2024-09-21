import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('referrals')
class ReferralsEntity {
  @PrimaryGeneratedColumn('uuid')
    id: string

  @Column({ type: 'uuid', nullable: false })
    user_id: string

  @Column({ type: 'uuid', nullable: false })
    referral_id: string
}

export default ReferralsEntity
