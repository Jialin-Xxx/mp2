export interface Character {
  id?: string;
  name: string;
  actor?: string;
  house?: string;
  dateOfBirth?: string;
  ancestry?: string;
  patronus?: string;
  image?: string;
  species?: string;
  gender?: string;
  alive?: boolean;
}

export interface Spell {
  name: string;
  description?: string;
}
