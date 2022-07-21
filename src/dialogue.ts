import { DialoguePluginSettings } from './settings';
import { DialogueTitleMode } from './types/dialogueTitleMode';
import { CLASSES } from './constants/classes';
import { Message, SIDES } from './components/message';
import { Delimiter } from './components/delimiter';
import { Comment } from './components/comment';

abstract class KEYWORDS {
    static readonly LEFT_PATTERN = /^l(?:eft)?(?:-(\d+))?:/i;
    static readonly RIGHT_PATTERN = /^r(?:ight)?(?:-(\d+))?:/i;
    static readonly TITLE_MODE = 'titleMode:';
    static readonly MESSAGE_MAX_WIDTH = 'messageMaxWidth:';
    static readonly COMMENT_MAX_WIDTH = 'commentMaxWidth:';
    static readonly DELIMITER = /^-|delimiter/;
    static readonly COMMENT = '#';
    static readonly MESSAGE_LEFT = '<';
    static readonly MESSAGE_RIGHT = '>';
}

export interface Participant {
    title: string;
    renderedOnce: boolean;
    enforcedId: string;
}

export interface DialogueSettings {
    parent: HTMLElement;
    leftParticipant: Participant;
    rightParticipant: Participant;
    titleMode: DialogueTitleMode;
    messageMaxWidth: string;
    commentMaxWidth: string;
    participants: Map<string, number>;
}

export class DialogueRenderer {

    src: string;

    dialogueWrapperEl: HTMLElement;

    dialogueSettings: DialogueSettings;

    constructor(src: string, parent: HTMLElement, settings: DialoguePluginSettings) {
        this.src = src;

        this.dialogueWrapperEl = parent.createDiv({ cls: CLASSES.DIALOGUE_WRAPPER });

        this.dialogueSettings = {
            parent: this.dialogueWrapperEl,
            leftParticipant: {
                title: settings.defaultLeftTitle,
                renderedOnce: false,
                enforcedId: null,
            },
            rightParticipant: {
                title: settings.defaultRightTitle,
                renderedOnce: false,
                enforcedId: null,
            },
            titleMode: settings.defaultTitleMode,
            messageMaxWidth: settings.defaultMessageMaxWidth,
            commentMaxWidth: settings.defaultCommentMaxWidth,
            participants: new Map<string, number>(),
        }

        this.renderDialogue();
    }

    registerParticipant(participant: string) {
        if (!this.dialogueSettings.participants.has(participant)) {
            this.dialogueSettings.participants.set(participant, this.dialogueSettings.participants.size + 1); // starting from number 1
        }
    }

    getEnforcedId(pattern: RegExp, line: string): string {
        let enforcedId = null;
        const result = pattern.exec(line);
        if (result != null && result.length > 1) {
            enforcedId = result[1];
        }

        return enforcedId;
    }

    renderDialogue() {
        const lines = this.src
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(line => line.length > 0);

        for (const line of lines) {

            if (KEYWORDS.LEFT_PATTERN.test(line)) {
                this.dialogueSettings.leftParticipant.title = line.split(':').splice(1).join(':').trim();
                this.dialogueSettings.leftParticipant.renderedOnce = false; // reset this flag when a new title is set
                this.dialogueSettings.leftParticipant.enforcedId = this.getEnforcedId(KEYWORDS.LEFT_PATTERN, line);
            }
            else if (KEYWORDS.RIGHT_PATTERN.test(line)) {
                this.dialogueSettings.rightParticipant.title = line.split(':').splice(1).join(':').trim();
                this.dialogueSettings.rightParticipant.renderedOnce = false; // reset this flag when a new title is set
                this.dialogueSettings.rightParticipant.enforcedId = this.getEnforcedId(KEYWORDS.RIGHT_PATTERN, line);
            }
            else if (line.startsWith(KEYWORDS.TITLE_MODE)) {
                const modeName = line.substr(KEYWORDS.TITLE_MODE.length).trim().toLowerCase();
                if (Object.values(DialogueTitleMode).some(mode => mode == modeName)) {
                    this.dialogueSettings.titleMode = modeName as DialogueTitleMode;
                }
            }
            else if (line.startsWith(KEYWORDS.MESSAGE_MAX_WIDTH)) {
                this.dialogueSettings.messageMaxWidth = line.substr(KEYWORDS.MESSAGE_MAX_WIDTH.length).trim();
            }
            else if (line.startsWith(KEYWORDS.COMMENT_MAX_WIDTH)) {
                this.dialogueSettings.commentMaxWidth = line.substr(KEYWORDS.COMMENT_MAX_WIDTH.length).trim();
            }
            else if (KEYWORDS.DELIMITER.test(line)) {
                new Delimiter(this.dialogueSettings);
            }
            else if (line.startsWith(KEYWORDS.COMMENT)) {
                const content = line.substr(KEYWORDS.COMMENT.length);

                new Comment(content, this.dialogueSettings);
            }
            else if (line.startsWith(KEYWORDS.MESSAGE_LEFT)) {
                const content = line.substr(KEYWORDS.MESSAGE_LEFT.length).trim();
                this.registerParticipant(this.dialogueSettings.leftParticipant.title);

                new Message(content, SIDES.LEFT, this.dialogueSettings);
            }
            else if (line.startsWith(KEYWORDS.MESSAGE_RIGHT)) {
                const content = line.substr(KEYWORDS.MESSAGE_RIGHT.length).trim();
                this.registerParticipant(this.dialogueSettings.rightParticipant.title);

                new Message(content, SIDES.RIGHT, this.dialogueSettings);
            }
        }
    }

}
