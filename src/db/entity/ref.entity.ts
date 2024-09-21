import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('ref')
class RefEntity {
  @PrimaryGeneratedColumn()
    id: number

  @Column({ type: 'int' })
    user_id: number

  @Column({ type: 'int' })
    ref_id: number
}

export default RefEntity
