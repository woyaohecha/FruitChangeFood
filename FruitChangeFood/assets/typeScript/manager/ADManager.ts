import { _decorator, Component, Node, VideoPlayer, VideoClip, resources, AudioSource, UITransform, Camera, Canvas, view } from 'cc';
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
    public static videoPlayer: any = null;
    public static mainCanvas: Node = null;
    public static adCanvas: Node = null;
    public static gameAudioSource: AudioSource = null;

    public static showVideoAd(completed: Function) {
        let remoteURL = this.videoClipUrls[Tools.getRandomNum(0, 3)];
        const frameSize = view.getFrameSize();
        this.videoPlayer = wx.createVideo({
            x: 0,
            y: 0,
            width: frameSize.width,
            height: frameSize.height,
            src: remoteURL,
            initialTime: 0,
            controls: false,
            showProgress: false,
            showProgressInControlMode: false,
            autoplay: true,
            underGameView: true, // 这句是关键
        });
        this.videoPlayer.onplay = () => {
            console.log("开始播放");
            if (AudioManager.canMusicPlay) {
                this.gameAudioSource.pause();
            }
            this.mainCanvas.active = false;
            this.adCanvas.active = true;
        };
        this.videoPlayer.onended = () => {
            if (AudioManager.canMusicPlay) {
                this.gameAudioSource.play();
            }
            if (this.videoPlayer) {
                this.videoPlayer.destroy();
                this.videoPlayer = null;
            }
            this.mainCanvas.active = true;
            this.adCanvas.active = false;
            completed();
            console.log("结束播放");
        };

    }

    public static stopVideo() {
        if (AudioManager.canMusicPlay) {
            this.gameAudioSource.play();
        }
        if (this.videoPlayer) {
            this.videoPlayer.destroy();
            this.videoPlayer = null;
        }
        this.mainCanvas.active = true;
        this.adCanvas.active = false;
        console.log("未播放完成");
    }

    public static setMuted() {
        if (this.videoPlayer) {
            this.videoPlayer.muted = true;
        }
    }
}

