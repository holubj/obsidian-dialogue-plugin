import { DialoguePluginSettings } from './settings';
import { DialogueTitleMode } from './constants/dialogueTitleMode';
import { CLASSES } from './constants/classes';
import { Message, MESSAGE_OPERATORS, SIDES } from './components/message';
import { Delimiter } from './components/delimiter';
import { Comment } from './components/comment';

abstract class KEYWORDS {
    static readonly LEFT = 'left:';
    static readonly RIGHT = 'right:';
    static readonly TITLE_MODE = 'titleMode:';
    static readonly MESSAGE_MAX_WIDTH = 'messageMaxWidth:';
    static readonly COMMENT_MAX_WIDTH = 'commentMaxWidth:';
    static readonly DELIMITER = 'delimiter';
    static readonly COMMENT = '#';
}

export interface DialogueSettings {
    parent: HTMLElement;
    leftTitle: string;
    rightTitle: string;
    titleMode: DialogueTitleMode;
    messageMaxWidth: string;
    commentMaxWidth: string;
    leftTitleRenderedOnce: boolean;
    rightTitleRenderedOnce: boolean;
}

export class DialogueRenderer {

    src: string;

    dialogueWrapperEl: HTMLElement;

    dialogueSettings: DialogueSettings;

	constructor(src: string, parent: HTMLElement, settings: DialoguePluginSettings) {
		this.src = src;

        this.dialogueWrapperEl = parent.createDiv({cls: CLASSES.DIALOGUE_WRAPPER});

        this.dialogueSettings = {
            parent: this.dialogueWrapperEl,
            leftTitle: settings.defaultLeftTitle,
            rightTitle: settings.defaultRightTitle,
            titleMode: settings.defaultTitleMode,
            messageMaxWidth: settings.defaultMessageMaxWidth,
            commentMaxWidth: settings.defaultCommentMaxWidth,
            leftTitleRenderedOnce: false,
            rightTitleRenderedOnce: false,
        }

        this.renderDialogue();
	}

    renderDialogue() {
        const lines = this.src
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(line => line.length > 1);

        for ( const line of lines ) {

            if ( line.startsWith(KEYWORDS.LEFT) ) {
                this.dialogueSettings.leftTitle = line.substr(KEYWORDS.LEFT.length).trim();
                this.dialogueSettings.leftTitleRenderedOnce = false; // reset this flag when a new title is set
            }
            else if ( line.startsWith(KEYWORDS.RIGHT) ) {
                this.dialogueSettings.rightTitle = line.substr(KEYWORDS.RIGHT.length).trim();
                this.dialogueSettings.rightTitleRenderedOnce = false; // reset this flag when a new title is set
            }
            else if ( line.startsWith(KEYWORDS.MESSAGE_MAX_WIDTH) ) {
                this.dialogueSettings.messageMaxWidth = line.substr(KEYWORDS.MESSAGE_MAX_WIDTH.length).trim();
            }
            else if ( line.startsWith(KEYWORDS.COMMENT_MAX_WIDTH) ) {
                this.dialogueSettings.commentMaxWidth = line.substr(KEYWORDS.COMMENT_MAX_WIDTH.length).trim();
            }
            else if ( line.startsWith(KEYWORDS.TITLE_MODE) ) {
                const modeName = line.substr(KEYWORDS.TITLE_MODE.length).trim().toLowerCase();
                if ( Object.values(DialogueTitleMode).some(mode => mode == modeName) ) {
                    this.dialogueSettings.titleMode = modeName as DialogueTitleMode;
                }
            }
            else if ( line.startsWith(KEYWORDS.DELIMITER) ) {
                new Delimiter(this.dialogueSettings);
            }
            else if ( line.startsWith(KEYWORDS.COMMENT) ) {
                const content = line.substr(KEYWORDS.COMMENT.length);

                new Comment(content, this.dialogueSettings);
            }
            else {
                const operator = line.substr(0, 1);
                if ( !MESSAGE_OPERATORS.isValidOperator(operator) ) continue;

                const content = line.substr(1);

                new Message(content, SIDES.getSideByOperator(operator), this.dialogueSettings);
            }
        }
    }

}
