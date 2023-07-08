import { CLASSES } from '../constants/classes';
import { DialogueSettings } from '../dialogue';

export class Comment {

    dialogueSettings: DialogueSettings;

    constructor(dialogueSettings: DialogueSettings) {
        this.dialogueSettings = dialogueSettings;
    }

    renderComment(content?: string) {
        const commentEl = this.dialogueSettings.parent.createDiv({
            cls: `${CLASSES.BLOCK_WRAPPER} ${CLASSES.COMMENT_WRAPPER}`
        });

        return commentEl.createDiv({
            cls: CLASSES.COMMENT,
            text: content,
            attr: {
                style: `max-width: ${this.dialogueSettings.commentMaxWidth};`
            }
        });
    }
}
