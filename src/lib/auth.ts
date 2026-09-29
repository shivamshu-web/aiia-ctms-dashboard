export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const defaultUser: SessionUser = {
  id: 'usr_meera_01',
  name: 'Dr. Meera Sharma',
  email: 'meera.sharma@aiia.gov.in',
  role: 'PRINCIPAL_INVESTIGATOR',
};
