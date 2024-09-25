import { SquadRepository, UserRepository } from '../../db'
import type UserEntity from '../../db/entity/user.entity'

const checkSquad = async (payload: string, user: UserEntity) => {
  try {
    const squadId = payload.split('_')?.[1]

    const squad = await SquadRepository.findOneBy({ id: squadId })

    if (squad) {
      user.squad_id = squad.id

      await UserRepository.save(user)

      return squad
    }
  } catch (e) {
    console.log(`Error in checkSquad: ${e.message}`)
  }
}

export default checkSquad
