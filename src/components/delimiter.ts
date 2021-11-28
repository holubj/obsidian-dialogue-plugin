import { CLASSES } from '../constants/classes';
import { DialogueSettings } from '../dialogue';

export class Delimiter {

    dialogueSettings: DialogueSettings;

	constructor(dialogueSettings: DialogueSettings) {
        this.dialogueSettings = dialogueSettings;

        this.renderDelimiter();
	}

    renderDelimiter() {
        const delimiterWrapperEl = this.dialogueSettings.parent.createDiv({
            cls: `${CLASSES.BLOCK_WRAPPER} ${CLASSES.DELIMITER_WRAPPER}`
        });

        const delimiterEl = delimiterWrapperEl.createDiv({cls: CLASSES.DELIMITER});

        delimiterEl.createEl('div', {cls: CLASSES.DELIMITER_DOT});
        delimiterEl.createEl('div', {cls: CLASSES.DELIMITER_DOT});
        delimiterEl.createEl('div', {cls: CLASSES.DELIMITER_DOT});
    }
}
