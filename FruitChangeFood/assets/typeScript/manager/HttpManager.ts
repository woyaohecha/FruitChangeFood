import { _decorator, Component, Node } from 'cc';
import { AppConfig } from '../AppConfig';
const { ccclass, property } = _decorator;

const httpUrl = "http://eliminate-game.sxycykj.net//api/app/clientAPI/";
const getOpenId = "getOpenId/?";
const saveUserInfo = "saveUserInfo/?";
const saveLevelByUid = "saveLevelByUid/?";
const getRank = "getRank";


@ccclass('HttpManager')
export class HttpManager {
    private static uid: number = 20230521;
    private static nickname: string = "default_nickname";
    private static img: string = "default_img";

    private static httpRequest(apiUrl: string, completed: Function, data) {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                completed(xhr.responseText);
            }
        };
        let url = httpUrl + apiUrl + data;
        xhr.open("GET", url, true);
        xhr.send();
    }

    public static getOpenId(code) {
        let data = "appid=" + AppConfig.appid + "&&secret=" + AppConfig.secret + "&&js_code=" + code;
        this.httpRequest(getOpenId, (res) => {
            console.log("getOpenId:", res);
            this.uid = res.data.openid;
            console.log("获取用户uid:", this.uid);
        }, data)
    }

    public static saveUserInfo() {
        let data = "uid=" + this.uid + "&&nickname=" + this.nickname + "&&img=" + this.img;
        this.httpRequest(saveUserInfo, (res) => {
            console.log("保存用户信息:", res);
        }, data)
    }

    public static saveLevelByUid(levelNum: number, levelTime: number) {
        let data = "uid=" + this.uid + "&&level_num=" + levelNum + "&&level_time=" + levelTime;
        this.httpRequest(saveLevelByUid, (res) => {
            console.log("保存关卡信息:", res);
        }, data)
    }

    public static getRank(completed: Function) {
        this.httpRequest(getRank, completed, "");
    }
}

