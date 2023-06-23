import { _decorator, Component, Node, resources, JsonAsset, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

export class JsonManager {

    public static getLayerInfo: any;
    public static bookList: any;

    public static jsonLoaded: boolean = false;

    public static loadHomeJson() {
        if (this.getLayerInfo && this.bookList.length > 0) {
            return;
        }
        resources.loadDir("json", JsonAsset, (e, assets: JsonAsset[]) => {
            if (e) {
                console.log("json加载失败", e);
                return;
            }
            this.getLayerInfo = assets.find(asset => {
                return asset.name == "GetConfig";
            }).json;
            this.bookList = assets.find(asset => {
                return asset.name == "BookConfig";
            }).json;
            console.log("------------------------------------json加载完成");
            console.log(this.getLayerInfo, this.bookList);

            resources.loadDir("bookIcons", SpriteFrame, (e, assets: SpriteFrame[]) => {
                if (e) {
                    console.log("bookIcons加载失败:", e);
                    return;
                }
                assets.sort((a, b) => {
                    return Number(a.name) - Number(b.name);
                })
                for (let i = 0; i < this.bookList.length; i++) {
                    this.bookList[i].icon = assets[i];
                }
                console.log("------------------------------------bookIcons加载完成");
                console.log(this.bookList);

                this.jsonLoaded = true;
            })
        })


    }
}

