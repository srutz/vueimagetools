import { defineStore } from "pinia";

export type ImageType = {
  id: string;
  name: string;
  data: ImageBitmap;
  dirty: boolean;
  undoStack: ImageBitmap[];
  redoStack: ImageBitmap[];
  fileSize?: number;
  mimeType?: string;
};

type ImagesState = {
  images: ImageType[];
};

const MAX_UNDO_STEPS = 20;

export const useImages = defineStore("images", {
  state: (): ImagesState => {
    return { images: [] };
  },
  actions: {
    addImage(image: ImageType) {
      this.images.push(image);
    },
    removeImage(id: string) {
      const image = this.images.find((i) => i.id === id);
      if (image) {
        image.data.close();
        image.undoStack.forEach((b) => b.close());
        image.redoStack.forEach((b) => b.close());
      }
      this.images = this.images.filter((i) => i.id !== id);
    },
    updateImage(id: string, data: ImageBitmap) {
      const image = this.images.find((i) => i.id === id);
      if (!image) return;
      if (image.undoStack.length >= MAX_UNDO_STEPS) {
        image.undoStack.shift()!.close();
      }
      image.undoStack.push(image.data);
      image.redoStack.forEach((b) => b.close());
      image.redoStack = [];
      image.data = data;
      image.dirty = true;
    },
    undoImage(id: string) {
      const image = this.images.find((i) => i.id === id);
      if (!image || !image.undoStack.length) return;
      image.redoStack.push(image.data);
      image.data = image.undoStack.pop()!;
      image.dirty = image.undoStack.length > 0;
    },
    renameImage(id: string, name: string) {
      const image = this.images.find((i) => i.id === id);
      if (image) image.name = name;
    },
    redoImage(id: string) {
      const image = this.images.find((i) => i.id === id);
      if (!image || !image.redoStack.length) return;
      image.undoStack.push(image.data);
      image.data = image.redoStack.pop()!;
      image.dirty = true;
    },
  },
});
