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
    private static nickName: string = "default_nickname";
    private static avatarUrl: string = "default_img";

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

    public static getOpenId(code, success: Function) {
        let data = "appid=" + AppConfig.appid + "&secret=" + AppConfig.secret + "&js_code=" + code;
        console.log("getOpenId-data:", data);
        this.httpRequest(getOpenId, (res) => {
            console.log("getOpenId-res:", res);
            this.uid = JSON.parse(res).data.openid;
            console.log("uid:", this.uid);
            success();
        }, data)
    }

    public static saveUserInfo(nickName, avatarUrl) {
        this.nickName = nickName;
        this.avatarUrl = avatarUrl;
        let data = "uid=" + this.uid + "&nickname=" + this.nickName + "&img=" + this.avatarUrl;
        console.log("saveUserInfo-data:", data);
        this.httpRequest(saveUserInfo, (res) => {
            console.log("保存用户信息:", res);
        }, data)
    }

    public static saveLevelByUid(levelNum: number, levelTime: number) {
        let data = "uid=" + this.uid + "&level_num=" + levelNum + "&level_time=" + levelTime;
        console.log("saveUsaveLevelByUid-data:", data);
        this.httpRequest(saveLevelByUid, (res) => {
            console.log("保存关卡信息:", res);
        }, data)
    }

    public static getRank(completed: Function) {
        this.httpRequest(getRank, completed, "");
    }
}

