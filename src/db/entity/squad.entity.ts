import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('squads')
class SquadEntity {
  @PrimaryGeneratedColumn('uuid')
    id: string

  @Column()
    name: string

  @Column({ nullable: true })
    image: string

  @Column({ type: 'uuid', nullable: true })
    owner: string

  @Column({ type: 'decimal', nullable: true })
    chat_id: string
}

export default SquadEntity
