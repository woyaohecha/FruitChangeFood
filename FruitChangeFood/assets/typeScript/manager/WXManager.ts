import { _decorator, Component, Node } from 'cc';
import { wx } from '../layer/Loading';
import Tools from '../Tools';
import { HttpManager } from './HttpManager';
const { ccclass, property } = _decorator;

export class WXManager {

    public static wxLogin(btnInfo: any, onRankGetSettingSuccess: Function) {
        console.log("进入微信登录");
        if (Tools.platform != "wx") {
            return;
        }
        let self = this;
        wx.login({
            success: res => {
                console.log("微信登录成功:", res);
                HttpManager.getOpenId(res.code);
                self.onGetSetting(btnInfo, onRankGetSettingSuccess);
            },
            fail: res => {
                console.log("登录失败", res);
            }
        })
    }

    public static onGetSetting(btnInfo, onRankGetSettingSuccess: Function) {
        wx.getSetting({
            success: res => {
                if (res.authSetting["scope.userInfo"]) {
                    wx.getUserInfo({
                        success: res => {
                            console.log("获取用户信息成功：", res);
                        },
                        fail: res => {
                            console.log("获取用户信息失败：", res);
                        }
                    })
                } else {
                    console.log("创建全屏授权按钮");
                    let sysInfo = wx.getSystemInfoSync();
                    let button = wx.createUserInfoButton({
                        lang: "zh_CN",  // 返回信息的展示方式，en:英文类型，zh_CN:简体中文，zh_TW:繁体中文
                        type: "text",
                        text: "",
                        style: {
                            left: 0,
                            top: 0,
                            width: sysInfo.windowWidth,
                            height: sysInfo.windowHeight,
                            backgroundColor: "#00000000",
                            borderColor: "#ffffff",
                            textAlign: "center",
                            fontSize: 16,
                            lineHeight: sysInfo.windowHeight,
                        }
                    })

                    button.onTap(res => {
                        if (res.userInfo) {
                            console.log("全屏按钮授权成功：", res);
                            button.destroy();
                        } else {
                            console.log("全屏按钮授权失败：", res);
                            this.createRankOnGetUserInfoBtn(btnInfo, onRankGetSettingSuccess);
                            button.destroy();
                        }
                    })
                    button.show();
                }
            }
        })
    }

    public static createRankOnGetUserInfoBtn(btnInfo, onRankGetSettingSuccess: Function) {
        console.log("创建排行榜授权按钮:", btnInfo);
        let button = wx.createUserInfoButton({
            lang: "zh_CN",  // 返回信息的展示方式，en:英文类型，zh_CN:简体中文，zh_TW:繁体中文
            type: "text",
            text: "",
            style: {
                left: btnInfo.left,
                top: btnInfo.top,
                width: btnInfo.width,
                height: btnInfo.height,
                backgroundColor: "#00000000",
                borderColor: "#ffffff",
                textAlign: "center",
                fontSize: 16,
                lineHeight: 16,
            }
        })
        console.log("等待点击排行榜授权按钮:", button);
        button.onTap(res => {
            if (res.userInfo) {
                console.log("排行榜授权成功：", res);
                button.destroy();
                onRankGetSettingSuccess();
            } else {
                console.log("排行榜授权失败：", res);
                wx.showModal({
                    title: "温馨提示",
                    content: "需要您的用户信息才可以查看排行榜！",
                    showCancel: false
                });
            }
        })
        button.show();
    }
}

