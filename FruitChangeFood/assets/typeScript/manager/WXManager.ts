import { _decorator, Component, Node, UITransform, view } from 'cc';
import { wx } from '../layer/Loading';
import Tools from '../Tools';
import { HttpManager } from './HttpManager';
const { ccclass, property } = _decorator;

export class WXManager {

    public static wxLogin(btnInfo: any, onRankGetSettingSuccess: Function) {
        console.log("进入微信登录");
        if (Tools.platform != "wx") {
            console.log("不是微信平台！");
            return;
        }
        let self = this;
        wx.login({
            success: res => {
                console.log("微信登录成功:", res);
                HttpManager.getOpenId(res.code, () => {
                    self.onGetSetting(btnInfo, onRankGetSettingSuccess);
                });
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
                            HttpManager.saveUserInfo(res.userInfo.nickName, res.userInfo.avatarUrl);
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
                            console.log("全屏按钮授权成功：", res.userInfo);
                            HttpManager.saveUserInfo(res.userInfo.nickName, res.userInfo.avatarUrl);
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
        console.log("创建排行榜授权按钮成功:", button);
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

    public static getBtnRankRect(btn: Node, caNode: Node) {
        // wx.getSystemInfo 的同步版本
        if (!wx) {
            return;
        }
        let sys = wx.getSystemInfoSync();
        let rect = btn.getComponent(UITransform).getBoundingBoxToWorld();
        let ratio = view.getDevicePixelRatio();
        let scale = view.getScaleX();
        let factor = scale / ratio;

        let diffY = caNode.getComponent(UITransform).height - view.getDesignResolutionSize().height;
        let left = rect.x * factor;
        let top = sys.screenHeight - (rect.y + rect.height) * factor - diffY / 2 * factor;
        let w = rect.width * factor;
        let h = rect.height * factor;

        // 手机屏幕 的区域 rect
        let srect = { left: left, top: top, width: w, height: h };
        return srect;
    }
}

