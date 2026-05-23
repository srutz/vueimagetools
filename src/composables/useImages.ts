import { defineStore } from "pinia";

export type ImageType = {
  id: string;
  name: string;
  data: ImageBitmap;
};

type ImagesState = {
  images: ImageType[];
};

export const useImages = defineStore("images", {
  state: (): ImagesState => {
    return { images: [] };
  },
  actions: {
    addImage(image: ImageType) {
      this.images.push(image);
    },
    removeImage(id: string) {
      this.images = this.images.filter((image) => image.id !== id);
    },
  },
});
