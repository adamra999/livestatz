export interface ProfileData {
  full_name: string;
  email: string;
  avatar_url: string;
  phone: string;
  username: string;
}

export interface ProfileState extends ProfileData {
  loading: boolean;
  uploading: boolean;
}

