import { App, Setting, PluginSettingTab } from 'obsidian';
import DialoguePlugin from './main';
import { DialogueTitleMode } from './types/dialogueTitleMode';

export interface DialoguePluginSettings {
	defaultLeftTitle: string;
	defaultRightTitle: string;
	defaultCenterTitle: string;
	defaultTitleMode: DialogueTitleMode;
	defaultMessageMaxWidth: string;
	defaultCommentMaxWidth: string;
}

export const DEFAULT_SETTINGS: DialoguePluginSettings = {
	defaultLeftTitle: '',
	defaultRightTitle: '',
	defaultCenterTitle: '',
	defaultTitleMode: DialogueTitleMode.First,
	defaultMessageMaxWidth: '60%',
	defaultCommentMaxWidth: '60%',
}

export class DialogueSettingTab extends PluginSettingTab {

	plugin: DialoguePlugin;

	constructor(app: App, plugin: DialoguePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Dialogue Settings' });

		const coffeeEl = containerEl.createEl('div', {
			attr: {
				style: "text-align: center; margin-bottom: 10px;"
			}
		});
		const coffeeLinkEl = coffeeEl.createEl('a', { href: "https://www.buymeacoffee.com/holubj" });
		coffeeLinkEl.createEl('img', {
			attr: {
				src: "https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png",
				alt: "Buy Me A Coffee",
				style: "height: 60px; width: 217px;"
			}
		});

		new Setting(containerEl)
			.setName('Default left title')
			.setDesc('Default value for left title in all dialogues.')
			.addText(text =>
				text.setPlaceholder('Enter default left title')
					.setValue(this.plugin.settings.defaultLeftTitle)
					.onChange(async (value) => {
						this.plugin.settings.defaultLeftTitle = value;
						await this.plugin.saveSettings();
					}));

		new Setting(containerEl)
			.setName('Default right title')
			.setDesc('Default value for right title in all dialogues.')
			.addText(text =>
				text.setPlaceholder('Enter default right title')
					.setValue(this.plugin.settings.defaultRightTitle)
					.onChange(async (value) => {
						this.plugin.settings.defaultRightTitle = value;
						await this.plugin.saveSettings();
					}));

		new Setting(containerEl)
			.setName('Default center title')
			.setDesc('Default value for center title in all dialogues.')
			.addText(text =>
				text.setPlaceholder('Enter default center title')
					.setValue(this.plugin.settings.defaultCenterTitle)
					.onChange(async (value) => {
						this.plugin.settings.defaultCenterTitle = value;
						await this.plugin.saveSettings();
					}));

		new Setting(containerEl)
			.setName('Default title mode')
			.setDesc('Default title mode in all dialogues.')
			.addDropdown(cb => {
				Object.values(DialogueTitleMode).forEach(titleMode => {
					const mode = titleMode.toString();
					cb.addOption(mode, mode.charAt(0).toUpperCase() + mode.slice(1));
				});

				cb.setValue(this.plugin.settings.defaultTitleMode)
					.onChange(async (value) => {
						this.plugin.settings.defaultTitleMode = value as DialogueTitleMode;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName('Default max message width')
			.setDesc('Default max message width in all dialogues.')
			.addText(text =>
				text.setPlaceholder('Enter default max message width')
					.setValue(this.plugin.settings.defaultMessageMaxWidth)
					.onChange(async (value) => {
						this.plugin.settings.defaultMessageMaxWidth = value;
						await this.plugin.saveSettings();
					}));

		new Setting(containerEl)
			.setName('Default max comment width')
			.setDesc('Default max comment width in all dialogues.')
			.addText(text =>
				text.setPlaceholder('Enter default max comment width')
					.setValue(this.plugin.settings.defaultCommentMaxWidth)
					.onChange(async (value) => {
						this.plugin.settings.defaultCommentMaxWidth = value;
						await this.plugin.saveSettings();
					}));
	}
}
