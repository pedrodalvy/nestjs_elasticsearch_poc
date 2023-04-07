import { User } from '../interfaces/user.interface';

export class SearchUsersResponseDTO {
  from: number;
  size: number;
  data: User[];
}
