import { _decorator, Component, Node, Prefab, resources } from 'cc';
const { ccclass, property } = _decorator;

export class PrefabManager {
    public static rankItemPrefab: Prefab = null;
    public static bookItemPrefab: Prefab = null;
    public static tipsPrefab: Prefab = null;

    public static prefabsLoaded: boolean = false;

    public static loadPrefab() {
        resources.loadDir("prefabs", Prefab, (e, assets: Prefab[]) => {
            if (e) {
                console.log("prefabs加载失败", e);
                return;
            }
            this.bookItemPrefab = assets.find(asset => {
                return asset.name == "BookItem";
            })
            this.rankItemPrefab = assets.find(asset => {
                return asset.name == "RankItem";
            })
            this.tipsPrefab = assets.find(asset => {
                return asset.name == "Tips";
            })
            console.log("------------------------------------预制体加载完成：");
            console.log(this.rankItemPrefab, this.bookItemPrefab);
            this.prefabsLoaded = true;
        })
    }

}

