import { ReferralLinksRepository, ReferralsRepository, UserRepository } from '../../db'
import type UserEntity from '../../db/entity/user.entity'
import { RefType } from '../../db/entity/user.entity'

const bonusForInvite = {
  [RefType.INITIAL]: 1000,
  [RefType.LEVEL1]: 2000,
  [RefType.LEVEL2]: 3000
}

const checkRef = async (payload: string, user: UserEntity) => {
  const inviterUuid = payload.split('_')?.[1]

  if (user.id === inviterUuid) {
    return
  }

  if (!Number.isInteger(+inviterUuid)) {
    const inviter = await UserRepository.findOneBy({ id: inviterUuid })

    if (!inviter) {
      return false
    }

    const refsCount = await ReferralsRepository.countBy({ user_id: inviter.id })

    const refLink = await ReferralLinksRepository.findOneBy({ param: inviterUuid })

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

    const refType = refLink && refLink.count < refsCount
      ? inviter.ref_type
      : RefType.INITIAL

    const bonus = bonusForInvite[refType]

    inviter.balance = inviter.balance + bonus
    await UserRepository.save(inviter)

    user.balance = user.balance + bonus
    user.invited = inviter.id
    await UserRepository.save(user)

    return true
  }
}

export default checkRef
