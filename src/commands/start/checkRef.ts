import { ReferralLinksRepository, ReferralsRepository, RefRepository, UserRepository } from '../../db'
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
    return false
  }

  /*
  * Если ссылка число, то это просто ссылка для регистрации
  * Если uuid - то ссылка другого пользователя
  */
  if (Number.isInteger(+inviterUuid)) {
    const count = await RefRepository.countBy({ user_id: +inviterUuid })

    const refLink = await ReferralLinksRepository.findOneBy({ param: inviterUuid })

    if (!refLink) {
      return false
    }

    if (count > refLink.count) {
      return false
    }

    return true
  } else {
    const inviter = await UserRepository.findOneBy({ id: inviterUuid })

    if (!inviter) {
      return false
    }

    const refsCount = await ReferralsRepository.countBy({ user_id: inviter.id })

    const refLink = await ReferralLinksRepository.findOneBy({ param: inviterUuid })

    if (refLink) {
      if (refsCount > refLink.count) {
        return false
      }
    } else {
      if (refsCount > 2) {
        return false
      }
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
}

export default checkRef
