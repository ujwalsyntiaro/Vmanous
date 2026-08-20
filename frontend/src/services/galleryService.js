import { GALLERY_ITEMS } from '../constants/gallery';

const STORAGE_KEY = 'vmanous_gallery_items';

export const getGalleryItems = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(GALLERY_ITEMS));
      return GALLERY_ITEMS;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading gallery items from localStorage:', error);
    return GALLERY_ITEMS;
  }
};

export const saveGalleryItem = (itemData) => {
  try {
    const currentItems = getGalleryItems();
    let updatedItems;

    if (itemData.id) {
      // Update existing item
      updatedItems = currentItems.map(item =>
        item.id === itemData.id ? { ...item, ...itemData } : item
      );
    } else {
      // Add new item
      const newItem = {
        id: `g-${Date.now()}`,
        ...itemData,
        createdAt: new Date().toISOString()
      };
      updatedItems = [newItem, ...currentItems];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
    return { success: true, items: updatedItems };
  } catch (error) {
    console.error('Error saving gallery item:', error);
    return { success: false, error: error.message };
  }
};

export const deleteGalleryItem = (id) => {
  try {
    const currentItems = getGalleryItems();
    const updatedItems = currentItems.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
    return { success: true, items: updatedItems };
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return { success: false, error: error.message };
  }
};

export const resetGalleryItems = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(GALLERY_ITEMS));
    return GALLERY_ITEMS;
  } catch (error) {
    console.error('Error resetting gallery items:', error);
    return GALLERY_ITEMS;
  }
};
