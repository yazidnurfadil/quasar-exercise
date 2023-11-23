import { defineStore } from 'pinia';

export interface IModalState {
  isModalShow: boolean;
  icon: string;
  title: string;
  message: string;
  okLabel: string;
  color: 'green' | 'primary' | 'red';
  okAction?: () => void;
}

export const useModalStore = defineStore('modal', {
  state: (): IModalState => {
    return {
      isModalShow: false,
      icon: 'save',
      title: 'Save Movie',
      message: 'Make sure you are confident with this decision.',
      okLabel: 'Save',
      color: 'green',
      okAction: () => undefined,
    };
  },
  actions: {
    showCreateConfirm(cb: () => void) {
      this.isModalShow = true;
      this.icon = 'save';
      this.title = 'Create New Movie';
      this.message = 'Make sure you are confident with this decision.';
      this.okLabel = 'Create';
      this.color = 'primary';
      this.okAction = cb;
    },
    showUpdateConfirm(cb: () => void) {
      this.isModalShow = true;
      this.icon = 'save';
      this.title = 'Save Movie';
      this.message = 'Make sure you are confident with this decision.';
      this.okLabel = 'Save';
      this.color = 'green';
      this.okAction = cb;
    },
    showDeleteConfirm(title: string, cb: () => void) {
      this.isModalShow = true;
      this.icon = 'delete';
      this.title = 'Delete Movie';
      this.message = `Are you sure you want to delete '${title}' movie?`;
      this.okLabel = 'Delete';
      this.color = 'red';
      this.okAction = cb;
    },
  },
});
