import { QuillOptionsStatic } from 'quill';

export const QUILL_CONFIG: QuillOptionsStatic = {
  modules: {
    cursors: true,
    formula: true,
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: ['times-new-roman', 'arial', ''] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ size: ['14px', '16px', '18px'] }],
        [{ background: ['white', 'red', 'blue'] }],
        [{ align: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['code-block', 'blockquote', 'clean'],
        ['video'],
        ['formula'],
        ['comments-add'],
      ],
    },
    comment: {
      color: 'yellow',
      commentAuthorId: '1',
    },
  },

  placeholder: 'Type your text here...',
  theme: 'snow',
};
