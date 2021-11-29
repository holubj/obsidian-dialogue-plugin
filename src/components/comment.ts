import { CLASSES } from '../constants/classes';
import { DialogueSettings } from '../dialogue';

export class Comment {

    content: string;

    dialogueSettings: DialogueSettings;

	constructor(content: string, dialogueSettings: DialogueSettings) {
        this.content = content;
        this.dialogueSettings = dialogueSettings;

        this.renderComment();
	}

    renderComment() {
        const commentEl = this.dialogueSettings.parent.createDiv({
            cls: `${CLASSES.BLOCK_WRAPPER} ${CLASSES.COMMENT_WRAPPER}`
        });

        return commentEl.createDiv({
            cls: CLASSES.COMMENT,
            text: this.content,
            attr: {
                style: `max-width: ${this.dialogueSettings.commentMaxWidth};`
            }
        });
    }
}
