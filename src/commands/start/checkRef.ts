import { ReferralsRepository, UserRepository } from '../../db'
import type UserEntity from '../../db/entity/user.entity'
import { RefType } from '../../db/entity/user.entity'

const bonusForInvite = {
  [RefType.INITIAL]: 1000,
  [RefType.LEVEL1]: 2000,
  [RefType.LEVEL2]: 3000
}

const checkRef = async (payload: string, user: UserEntity) => {
  try {
    const inviterUuid = payload.split('_')?.[1]

    if (user.id === inviterUuid) {
      return
    }

    if (!Number.isInteger(+inviterUuid)) {
      const inviter = await UserRepository.findOneBy({ id: inviterUuid })

      if (!inviter) {
        return false
      }

      const refFinded = await ReferralsRepository.findOneBy({
        user_id: inviter.id,
        referral_id: user.id
      })

      if (refFinded) {
        return false
      }

      const newRef = ReferralsRepository.create({
        user_id: inviter.id,
        referral_id: user.id
      })

      await ReferralsRepository.save(newRef)

      const bonus = bonusForInvite[inviter.ref_type]

      inviter.balance = inviter.balance + bonus
      await UserRepository.save(inviter)

      user.balance = user.balance + bonus
      user.invited = inviter.id
      await UserRepository.save(user)

      return true
    }
  } catch (e) {
    console.log(`Error in checkRef: ${e.message}`)
  }
}

export default checkRef
