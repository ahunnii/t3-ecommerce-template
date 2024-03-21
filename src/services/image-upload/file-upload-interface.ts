// import type { FC } from "react";

export interface FileUpload {
  upload(): Promise<string>;
}

// class FileUploadProcessord {
//   constructor(private err: string) {
//     this.err = err;
//   }
// }

// interface ImageUploadProps {
//   disabled?: boolean;
//   onChange: (value: string) => void;
// }

// type TFileUploadProcessor = {
//   UploadComponent: FC<ImageUploadProps>;
// };

// const CloudinaryFileUploadProcessor = {};
