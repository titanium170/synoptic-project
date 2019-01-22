import { MediaFile } from "./media-file";

export class FileElement {
  id?: string;
  isFolder: boolean;
  name: string;
  parent: string;
  media?: MediaFile;
}
