import { _decorator, Component, Node, AudioSource, game, director } from 'cc';
import { AudioManager } from '../manager/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('SettingLayer')
export class SettingLayer extends Component {

    btnMusic: Node = null;
    btnSound: Node = null;
    layerPrivacy: Node = null;
    audioSource: AudioSource = null;

    onLoad() {
        this.btnMusic = this.node.getChildByName("Panel").getChildByName("Music").getChildByName("Btn");
        this.btnSound = this.node.getChildByName("Panel").getChildByName("Sound").getChildByName("Btn");
        this.layerPrivacy = this.node.parent.getChildByName("LayerPrivacy");
        this.audioSource = this.node.parent.getComponent(AudioSource);
    }

    start() {
        this.init();
    }

    init() {
        if (AudioManager.canMusicPlay) {
            this.setMusic("on");
        } else {
            this.setMusic("off");
        }

        if (AudioManager.canSoundPlay) {
            this.setSound("on");
        } else {
            this.setSound("off");
        }
    }

    setMusic(state: string) {
        if (state == "on") {
            if (!this.audioSource.playing) {
                this.btnMusic.getChildByName("On").active = true;
                this.btnMusic.getChildByName("Off").active = false;
                AudioManager.canMusicPlay = true;
                this.audioSource.play();
            }
        } else {
            if (this.audioSource.playing) {
                this.btnMusic.getChildByName("On").active = false;
                this.btnMusic.getChildByName("Off").active = true;
                AudioManager.canMusicPlay = false;
                this.audioSource.pause();
            }
        }
    }

    setSound(state: string) {
        if (state == "on") {
            this.btnSound.getChildByName("On").active = true;
            this.btnSound.getChildByName("Off").active = false;
            AudioManager.canSoundPlay = true;
        } else {
            this.btnSound.getChildByName("On").active = false;
            this.btnSound.getChildByName("Off").active = true;
            AudioManager.canSoundPlay = false;
        }
    }

    onBtnMusic() {
        if (AudioManager.canMusicPlay) {
            this.setMusic("off");
        } else {
            this.setMusic("on");
        }
    }

    onBtnSound() {
        if (AudioManager.canSoundPlay) {
            this.setSound("off");
        } else {
            this.setSound("on");
        }
    }

    onBtnClose() {
        this.node.active = false;
    }

    onBtnGiveUp() {
        director.loadScene("Home");
    }

    onBtnPrivacy() {
        this.layerPrivacy.active = true;
    }

    onClosePrivacy() {
        this.layerPrivacy.active = false;
    }
}

