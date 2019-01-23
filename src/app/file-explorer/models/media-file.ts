import { Category } from './category';
import { Playlist } from './playlist';
import { Image } from './image';

export class MediaFile {
  name: string;
  path: string;
  type: string; // TODO:  restrict types
  comment?: string;
  category?: Category;
  playlists?: Playlist[];
  image?: Image;
}
