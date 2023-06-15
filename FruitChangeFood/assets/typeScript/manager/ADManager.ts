import { _decorator, Component, Node, VideoPlayer, VideoClip, resources, AudioSource, UITransform } from 'cc';
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
    public static videoClipUrls: string[] = [
        "https://cloudcreategame.oss-cn-beijing.aliyuncs.com/pro/games/test/sheep-sheep-res/dance.m4v",
        "https://cloudcreategame.oss-cn-beijing.aliyuncs.com/pro/games/test/sheep-sheep-res/father.m4v",
        "https://cloudcreategame.oss-cn-beijing.aliyuncs.com/pro/games/test/sheep-sheep-res/work.m4v",
        "https://cloudcreategame.oss-cn-beijing.aliyuncs.com/pro/games/test/sheep-sheep-res/world-cup.m4v"
    ]
    public static videoPlayer: VideoPlayer = null;
    public static gameAudioSource: AudioSource = null;

    public static showVideoAd(completed: Function) {
        // completed();
        // return;
        let index = Tools.getRandomNum(0, 3);
        this.videoPlayer.remoteURL = this.videoClipUrls[index];
        console.log("videoUrl:", this.videoClipUrls[index]);
        this.videoPlayer.node.once("ready-to-play", () => {
            console.log("ready-to-play");
            if (AudioManager.canMusicPlay) {
                this.gameAudioSource.pause();
            }
            // this.videoPlayer.stayOnBottom = false;
            this.videoPlayer.node.active = true;
            this.videoPlayer.play();
            console.log(this.videoPlayer.node, this.videoPlayer.clip);
        });
        this.videoPlayer.node.once("completed", () => {
            if (AudioManager.canMusicPlay) {
                this.gameAudioSource.play();
            }
            console.log("completed");
            this.videoPlayer.node.active = false;
            completed();
        }, this);
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

