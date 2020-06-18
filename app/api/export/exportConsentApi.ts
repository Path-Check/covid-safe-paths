import type { HealthcareAuthority } from '../healthcareAuthorities/getHealthcareAuthoritiesApi';

const exportConsentApi = async (
  authority: HealthcareAuthority,
  consent: boolean,
  code: number,
): Promise<void> => {
  const endpoint = `${authority.public_api}/consent`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ consent, accessCode: code }),
  });
  const success = res.status === 200;
  if (!success) {
    throw res.status;
  }
  return;
};

export default exportConsentApi;
