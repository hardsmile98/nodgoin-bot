import { Column, Entity, PrimaryColumn } from 'typeorm'
import { RefType } from './user.entity'

@Entity('ref_links')
class ReferralLinksEntity {
  @PrimaryColumn({ type: 'varchar' })
    param: string

  @Column({ type: 'int' })
    count: number

  @Column({
    type: 'enum',
    enum: RefType,
    default: RefType.INITIAL
  })
    ref_type: RefType
}

export default ReferralLinksEntity
