import { db } from '@/lib/firebase';
import { addSurveyBonusServer } from '@/components/userCredits';

export function generateReferralCode(identifier = '') {
  const cleanId = String(identifier)
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .slice(0, 4);
    
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  
  return `${cleanId || 'USER'}-${random}`;
}

export async function redeemReferralCode(currentUserEmail, inputCode) {
  const normalizedEmail = currentUserEmail.toLowerCase().trim();
  const code = inputCode.trim().toUpperCase();

  const referrers = await db.entities.User.filter({ referral_code: code });
  if (!referrers || referrers.length === 0) {
    throw new Error("Invalid referral code.");
  }
  
  const referrer = referrers[0];
  if (referrer.email.toLowerCase() === normalizedEmail) {
    throw new Error("You cannot use your own referral code.");
  }

  const existing = await db.entities.Referral.filter({ referred_email: normalizedEmail });
  if (existing && existing.length > 0) {
    throw new Error("You have already redeemed a referral code.");
  }

  const CREDIT_REWARD = 5;

  await addSurveyBonusServer(CREDIT_REWARD, "Referral bonus: invited a friend!", referrer.email);
  await addSurveyBonusServer(CREDIT_REWARD, "Referral bonus: welcome reward!", normalizedEmail);

  await db.entities.Referral.create({
    referrer_email: referrer.email,
    referred_email: normalizedEmail,
    code_used: code,
    status: "completed",
    reward_granted: CREDIT_REWARD,
    created_date: new Date().toISOString()
  });

  return { success: true, reward: CREDIT_REWARD };
}
