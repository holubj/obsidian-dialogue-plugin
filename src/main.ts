import { Plugin } from 'obsidian';
import { DialogueRenderer } from './dialogue';
import { DEFAULT_SETTINGS, DialoguePluginSettings, DialogueSettingTab } from './settings';


export default class DialoguePlugin extends Plugin {

	settings: DialoguePluginSettings;

	async onload() {
		await this.loadSettings();

		this.registerMarkdownCodeBlockProcessor(
            `dialogue`,
            (src, el, ctx) => {
				new DialogueRenderer(src, el, this.settings);
			}
        );

		this.addSettingTab(new DialogueSettingTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

}
