import Quill from 'quill';
import QuillCursors from 'quill-cursors';

export function registerModules(quill: typeof Quill) {
  let icons = Quill.import('ui/icons');
  icons['comments-add'] =
    '<button type="button" class="ql-comments-add">C</button>';

  const Parchment = Quill.import('parchment');

  let RangeIndex = new Parchment.Attributor.Attribute(
    'commentIndex',
    'ql-comment-index',
    {
      scope: Parchment.Scope.INLINE,
    }
  );

  let CommentAttr = new Parchment.Attributor.Attribute(
    'comment',
    'ql-comment',
    {
      scope: Parchment.Scope.INLINE,
    }
  );

  let CommentAuthorAttr = new Parchment.Attributor.Attribute(
    'commentAuthor',
    'ql-comment-author',
    {
      scope: Parchment.Scope.INLINE,
    }
  );

  let CommentTimestampAttr = new Parchment.Attributor.Attribute(
    'commentTimestamp',
    'ql-comment-timestamp',
    {
      scope: Parchment.Scope.INLINE,
    }
  );

  let CommentId = new Parchment.Attributor.Attribute('commentId', 'id', {
    scope: Parchment.Scope.INLINE,
  });

  let CommentAddOnAttr = new Parchment.Attributor.Attribute(
    'commentAddOn',
    'ql-comment-addon',
    {
      scope: Parchment.Scope.INLINE,
    }
  );
  class Comment {
    quill: Quill;

    options: any;
    isEnabled: boolean;

    styleElement: HTMLStyleElement;

    constructor(ql: Quill, opt: any) {
      this.quill = ql;
      this.options = opt;

      Quill.register(RangeIndex, true);
      Quill.register(CommentId, true);
      Quill.register(CommentAttr, true);
      Quill.register(CommentAuthorAttr, true);
      Quill.register(CommentTimestampAttr, true);
      Quill.register(CommentAddOnAttr, true);

      let toolbar = this.quill.getModule('toolbar');

      toolbar.addHandler('comments-add', () => this.addComment());

      toolbar.attach(document.querySelector('button.ql-comments-add'));
    }

    addComment() {
      let range = this.quill.getSelection();

      if (!range?.length) {
        return;
      }
      let userInput = prompt('Please enter comment');
      if (!userInput) {
        return;
      }
      let currentTimestamp = Math.round(new Date().getTime() / 1000);

      this.quill.formatText(
        range?.index as number,
        range?.length as number,
        'commentId',
        `ql-comment-${this.options.commentAuthorId}-${currentTimestamp}`,
        'user'
      );
      this.quill.formatText(
        range?.index as number,
        range?.length as number,
        'commentIndex',
        range?.index.toString(),
        'user'
      );

      this.quill.formatText(
        range?.index as number,
        range?.length as number,
        'comment',
        userInput,
        'user'
      );

      this.quill.formatText(
        range?.index as number,
        range?.length as number,
        'commentAuthor',
        this.options.commentAuthorId,
        'user'
      );

      this.quill.formatText(
        range?.index as number,
        range?.length as number,
        'commentTimestamp',
        currentTimestamp,
        'user'
      );
    }
  }

  // fonts and cursor module
  let Font = quill.import('formats/font');
  Font.whitelist = ['times-new-roman', 'arial'];

  quill.register(quill.import('formats/font'), true);
  quill.register('modules/cursors', QuillCursors);
  quill.register('modules/comment', Comment);
}
