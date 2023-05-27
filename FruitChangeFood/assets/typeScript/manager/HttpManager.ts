import { _decorator, Component, Node } from 'cc';
import { AppConfig } from '../AppConfig';
const { ccclass, property } = _decorator;

const httpUrl = "https://eliminate-game.sxycykj.net//api/app/clientAPI/";
const getOpenId = "getOpenId/?";  //获取openid（即为uid）接口
const saveUserInfo = "saveUserInfo/?";  //保存用户数据（头像，昵称）接口
const saveLevelByUid = "saveLevelByUid/?";//保存用户记录（关卡，对应时间，需要判断是否需要更新）
const getRank = "getRank"; //获取用户排行榜数据


@ccclass('HttpManager')
export class HttpManager {
    private static uid: number = 20230521;
    private static nickName: string = "default_nickname";
    private static avatarUrl: string = "default_img";
    public static levelNum: number = 0;
    private static levelTime: number = 0;

    //通用get请求
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

    //获取openid，存本地
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

    //根据uid保存用户信息
    public static saveUserInfo(nickName, avatarUrl) {
        this.nickName = nickName;
        this.avatarUrl = avatarUrl;
        let data = "uid=" + this.uid + "&nickname=" + this.nickName + "&img=" + this.avatarUrl;
        console.log("saveUserInfo-data:", data);
        this.httpRequest(saveUserInfo, (res) => {
            this.levelNum = JSON.parse(res).data.level_max;
            this.levelTime = Number(JSON.parse(res).data.level_time);
            console.log("保存用户信息:", res, this.levelNum, this.levelTime);

        }, data)
    }

    //根据uid保存关卡记录
    public static saveLevelByUid(levelNum: number, levelTime: number) {
        let data = "uid=" + this.uid + "&level_num=" + levelNum + "&level_time=" + levelTime;
        console.log("saveUsaveLevelByUid-data:", data);
        this.httpRequest(saveLevelByUid, (res) => {
            console.log("保存关卡信息:", res);
        }, data)
    }

    //获取排行榜数据
    public static getRank(completed: Function) {
        this.httpRequest(getRank, completed, "");
    }
}

