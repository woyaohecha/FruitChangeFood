/*
 * @Author: LXR 923390756@qq.com
 * @Date: 2023-05-19 23:45:28
 * @LastEditors: LXR 923390756@qq.com
 * @LastEditTime: 2023-07-13 05:31:51
 * @FilePath: \FruitChangeFood\assets\typeScript\block.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator, Component, Node, UITransform, Rect, SpriteFrame, Sprite, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('block')
export class block extends Component {

    @property({ type: Node })
    nodeYinYing = null

    @property({ type: Sprite })
    spYuanSu = null

    @property({ type: [SpriteFrame] })
    spfYuanSu = []

    canTouch: boolean;
    blockType: any;
    is_di: boolean;
    numDi: number;
    isXiaoChu: boolean;
    isMoving: boolean;
    v3BlockOld: Vec3;

    start() {

    }

    init(type) {
        this.blockType = type //0-14
        this.canTouch = true
        this.is_di = false
        this.spYuanSu.spriteFrame = this.spfYuanSu[this.blockType]
    }

    initDi(type) {
        this.v3BlockOld = new Vec3(0, 0, 0)
        this.isMoving = true
        this.isXiaoChu = false
        this.numDi = -1
        this.blockType = type //0-14
        this.canTouch = false
        this.is_di = true
        this.nodeYinYing.active = false
        this.spYuanSu.spriteFrame = this.spfYuanSu[this.blockType]
    }

    shuaXinBlockSPF(type) {
        this.blockType = type
        tween(this.spYuanSu.node)
            .to(0.1, { scale: new Vec3(0, 0, 0) })
            .call(() => {
                this.spYuanSu.spriteFrame = this.spfYuanSu[this.blockType]
            })
            .to(0.1, { scale: new Vec3(0.85, 0.85, 0.85) })
            .start()


    }

    setTouch(can_touch) {
        this.canTouch = can_touch
        if (this.canTouch) {
            this.nodeYinYing.active = false
        } else {
            this.nodeYinYing.active = true
        }
    }

    getBoundingBox_pz() {
        let num_pz = 5
        let node_UITransform_1 = this.node.getComponent(UITransform)
        let rect_1 = node_UITransform_1.getBoundingBox()
        let rect_3 = new Rect(rect_1.x + num_pz, rect_1.y + num_pz, rect_1.width - num_pz * 2, rect_1.height - num_pz * 2)
        return rect_3
    }


    update(deltaTime: number) {

    }
}

