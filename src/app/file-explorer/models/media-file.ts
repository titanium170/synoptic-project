import { Category } from './category';
import { Playlist } from './playlist';
import { Image } from './image';

export class MediaFile {
  name: string;
  path: string;
  type: string;
  comment?: string;
  categories?: Category[];
  playlists?: Playlist[];
  image?: Image;
}
