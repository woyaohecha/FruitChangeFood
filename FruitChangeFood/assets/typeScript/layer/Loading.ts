import { _decorator, Component, Node, director, sys, ProgressBar } from 'cc';
import { JsonManager } from '../manager/JsonManager';
import { PrefabManager } from '../manager/PrefabManager';
import Tools from '../Tools';

const { ccclass, property } = _decorator;

export const wx = window["wx"];

@ccclass('Loading')
export class Loading extends Component {

    loadingBar: ProgressBar = null;

    onLoad() {
        director.preloadScene("Home");
        Tools.getPlatformInfo();
        this.loadingBar = this.node.getChildByName("LoadingBar").getComponent(ProgressBar);

    }

    start() {
        this.initBar();
        this.loadRes();
    }

    update() {
        this.loadBar();
    }


    loadRes() {
        PrefabManager.loadPrefab();
        JsonManager.loadHomeJson();
    }

    initBar() {
        this.loadingBar.progress = 0;
    }

    loadBar() {
        if (this.loadingBar.progress >= 1) {
            return;
        }
        if (this.loadingBar.progress <= 0.9) {
            this.loadingBar.progress += 0.05 * Math.random();
        } else {
            if (PrefabManager.prefabsLoaded && JsonManager.jsonLoaded) {
                this.loadingBar.progress += 0.05 * Math.random();
            }
        }
        if (this.loadingBar.progress >= 1) {
            director.loadScene("Home");
        }
    }
}

