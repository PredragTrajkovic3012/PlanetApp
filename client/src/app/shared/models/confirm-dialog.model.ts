export interface ConfirmDialogData {
  title?: string;
  message: string;
  actionType?: 'create' | 'edit' | 'delete';
  itemName?: string;
  imageUrl?: string;
  confirmText?: string;
  cancelText?: string;
}
