import { _decorator, Component, Node, VideoPlayer, VideoClip, resources, AudioSource } from 'cc';
import { AdType, AppConfig } from '../AppConfig';
import { wx } from '../layer/Loading';
import Tools from '../Tools';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('ADManager')
export class ADManager {

    private static clipsCount: number = 1;
    private static clipsIndex: number = 0;

    public static videoClips: VideoClip[] = [];
    public static videoPlayer: VideoPlayer = null;
    public static gameAudioSource: AudioSource = null;

    public static showVideoAd(completed: Function) {
        console.log("AppConfig.adType:", AppConfig.adType);
        if (AppConfig.adType == AdType.LOCALAD) {
            this.showVideoAd_Local_WX(completed);
        } else {
            this.showVideoAd_WX(completed);
        }
    }

    private static showVideoAd_Local(completed: Function) {
        console.log("进入观看视频", this.videoPlayer);
        this.videoPlayer.clip = null;
        this.videoPlayer.node.once("ready-to-play", () => {
            console.log("ready-to-play");
            if (AudioManager.canMusicPlay) {
                this.gameAudioSource.pause();
            }
            this.videoPlayer.node.parent.active = true;
            this.videoPlayer.play();
        });
        this.videoPlayer.node.once("completed", () => {
            if (AudioManager.canMusicPlay) {
                this.gameAudioSource.play();
            }
            console.log("completed");
            this.videoPlayer.node.parent.active = false;
            completed();
        }, this);
        if (this.videoClips[this.clipsIndex]) {
            this.videoPlayer.clip = this.videoClips[this.clipsIndex];
        } else {
            resources.load("videoClips/" + this.clipsIndex, VideoClip, (e, asset: VideoClip) => {
                this.videoClips[this.clipsIndex] = asset;
                this.videoPlayer.clip = this.videoClips[this.clipsIndex];
            })
        }
    }

    private static showVideoAd_Local_WX(completed: Function) {
        console.log("completed");
        completed();
    }

    private static showVideoAd_WX(completed) {

    }
}

