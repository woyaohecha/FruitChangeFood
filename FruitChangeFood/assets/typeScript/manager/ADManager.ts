/*
 * @Author: LXR 923390756@qq.com
 * @Date: 2023-05-26 22:05:21
 * @LastEditors: LXR 923390756@qq.com
 * @LastEditTime: 2023-07-13 05:18:57
 * @FilePath: \FruitChangeFood\assets\typeScript\manager\ADManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator, Component, Node, VideoPlayer, VideoClip, resources, AudioSource, UITransform, Camera, Canvas, view, director, Director } from 'cc';
import { AdType, AppConfig } from '../AppConfig';
import { wx } from '../layer/Loading';
import Tools from '../Tools';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('ADManager')
export class ADManager {

    public static videoClipUrls: string[] = [
        "https://cloudcreategame.oss-cn-beijing.aliyuncs.com/pro/games/test/sheep-sheep-res/dance.m4v",
        "https://cloudcreategame.oss-cn-beijing.aliyuncs.com/pro/games/test/sheep-sheep-res/father.m4v",
        "https://cloudcreategame.oss-cn-beijing.aliyuncs.com/pro/games/test/sheep-sheep-res/work.m4v",
        "https://cloudcreategame.oss-cn-beijing.aliyuncs.com/pro/games/test/sheep-sheep-res/world-cup.m4v"
    ]
    public static videoPlayer: VideoPlayer = null;
    // public static mainCanvas: Node = null;
    // public static adCanvas: Node = null;
    public static gameAudioSource: AudioSource = null;

    // public static showVideoAd(completed: Function) {
    //     let remoteURL = this.videoClipUrls[Tools.getRandomNum(0, 3)];
    //     const frameSize = view.getFrameSize();
    //     this.videoPlayer = wx.createVideo({
    //         x: 0,
    //         y: 0,
    //         width: frameSize.width,
    //         height: frameSize.height,
    //         src: remoteURL,
    //         initialTime: 0,
    //         controls: true,
    //         showProgress: false,
    //         showProgressInControlMode: false,
    //         autoplay: true,
    //         underGameView: true, // 这句是关键
    //     });
    //     this.videoPlayer.onplay = () => {
    //         console.log("开始播放");
    //         if (AudioManager.canMusicPlay) {
    //             this.gameAudioSource.pause();
    //         }
    //         // this.mainCanvas.active = false;
    //         // this.adCanvas.active = true;
    //     };
    //     this.videoPlayer.onended = () => {
    //         if (AudioManager.canMusicPlay) {
    //             this.gameAudioSource.play();
    //         }
    //         if (this.videoPlayer) {
    //             this.videoPlayer.destroy();
    //             this.videoPlayer = null;
    //         }
    //         // this.mainCanvas.active = true;
    //         // this.adCanvas.active = false;
    //         completed();
    //         console.log("结束播放");
    //     };

    // }

    public static showVideoAd1(completed: Function) {
        this.videoPlayer.remoteURL = this.videoClipUrls[Tools.getRandomNum(0, 3)];
        this.videoPlayer.node.once(VideoPlayer.EventType.READY_TO_PLAY, () => {
            console.log("ready-to-play");
            this.videoPlayer.node.parent.active = true;
            this.videoPlayer.node.active = true;
            this.videoPlayer.play();
            if (AudioManager.canMusicPlay) {
                this.gameAudioSource.pause();
            }
        })
        this.videoPlayer.node.once(VideoPlayer.EventType.COMPLETED, () => {
            console.log("completed");
            this.videoPlayer.node.parent.active = false;
            this.videoPlayer.node.active = false;
            this.videoPlayer.remoteURL = null;
            if (AudioManager.canMusicPlay) {
                this.gameAudioSource.play();
            }
            completed();
        })
    }
    // public static stopVideo() {
    //     if (AudioManager.canMusicPlay) {
    //         this.gameAudioSource.play();
    //     }
    //     if (this.videoPlayer) {
    //         this.videoPlayer.destroy();
    //         this.videoPlayer = null;
    //     }
    //     // this.mainCanvas.active = true;
    //     // this.adCanvas.active = false;
    //     console.log("未播放完成");
    // }
    public static stopVideo1() {
        console.log("closed");
        this.videoPlayer.node.parent.active = false;
        this.videoPlayer.node.active = false;
        this.videoPlayer.remoteURL = null;
        if (AudioManager.canMusicPlay) {
            this.gameAudioSource.play();
        }
    }

    // public static setMuted() {
    //     if (this.videoPlayer) {
    //         this.videoPlayer.muted = true;
    //     }
    // }
}

