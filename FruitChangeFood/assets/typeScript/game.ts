import { _decorator, Component, Node, Prefab, instantiate, input, Input, EventTouch, UITransform, Vec3, Vec2, Color, Sprite, tween, Label, AudioSource, AudioClip, sys, view } from 'cc';
import { block } from './block';
import { gameData } from './gameData';
const { ccclass, property } = _decorator;

@ccclass('game')
export class game extends Component {

    @property({ type: Prefab })
    preBlock = null

    @property({ type: Node })
    parentBlocks = null

    @property({ type: Node })
    parentBlocksDi = null

    @property({ type: Node })
    nodeTip = null

    @property({ type: Label })
    labelLevel = null

    @property({ type: Node })
    layerOver = null

    @property({ type: Node })
    parentEdit = null

    @property({ type: Label })
    labelBlocksInfo = null

    @property({ type: Prefab })
    preBlockEdit = null

    @property({ type: [Label] })
    arrLabelDJ = []

    @property({ type: [AudioClip] })
    arrAudio = []


    numTouchStart: number;
    numTouchEnd: number;
    gameData: gameData;
    numLevel: number;
    xxStartDi: number;
    yyBlockChu: number;
    gameType: number;
    numBlockTypeGeShu: number;
    numBlockType: number;
    numBlocksKuaiGeShu: number;
    numBlocksKuai: number;
    arrNumDJ: number[];
    audioSource: AudioSource;
    isEditing: boolean;
    numTypeEdit: number;
    numBlockEditMove: number;
    numTypeSuiJi: number;
    numSuiJi: number;
    bannerAd: any;
    wx: any;
    isWX: boolean;
    idBannerAD: any;
    interstitialAd: any;
    videoAd: any;
    numDJ: number;
    idChaPingAD: string;
    idJiLiShiPinAD: string;
    f_scale: number;

    start() {
        console.log('start');

        this.isWX = false
        this.wx = window['wx']
        this.idBannerAD = 'xxxxxx'//banner广告位id
        this.idChaPingAD = 'xxxxxx'//插屏广告位id
        this.idJiLiShiPinAD = 'xxxxxx'//激励视频广告位id

        this.numLevel = 0 //0：第一关
        this.numBlockTypeGeShu = 10 //随机关卡，种类的最少个数
        this.numBlockType = 2 //随机关卡，下一关比该关卡多几个种类
        this.numBlocksKuaiGeShu = 99 //随机关卡，最少个块数 必须是3的倍数
        this.numBlocksKuai = 6 //随机关卡，下一关比该关卡多几个块 必须是3的倍数
        this.arrNumDJ = [3, 3, 3, 3]//每个道具的个数
        this.isEditing = this.parentEdit.active //是否是编辑模式
        this.numTypeEdit = 1//(0:减，1：加)
        this.numTypeSuiJi = 2 //随机模式下，用那种类型的坐标（0：随机的 1：规范的 2：有随机也有规范）
        this.numSuiJi = 200 //编辑模式下，随机按钮产生的块的个数

        this.numDJ = -1//(0:移出道具，1：撤回道具 2：洗牌道具 3：复活道具)

        this.f_scale = view.getVisibleSize().width / 720.0

        this.parentBlocks.scale = new Vec3(this.f_scale, this.f_scale, this.f_scale)
        this.parentBlocksDi.scale = new Vec3(this.f_scale, this.f_scale, this.f_scale)
        console.log(this.f_scale);

        this.audioSource = this.node.getComponent(AudioSource)

        this.yyBlockChu = 120//移出的y坐标
        this.xxStartDi = 610 / 2 - 280 - 610 / 2 + 40
        this.gameData = this.node.getComponent(gameData)

        this.createBlocksEdit()

        this.init()

        if (this.isWX) {
            this.bannerAd = null
            this.interstitialAd = null
            this.videoAd = null

            this.initBannerAD()
            this.initChaPing()
            this.initJiLiShiPin()

            this.wx.showShareMenu()//打开分享菜单

            this.scheduleOnce(function () {
                this.bannerAd.show()
                    .then(() => console.log('banner 广告显示'))
            }, 5)
        }

        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);

    }

    //分享给好友
    shareFirend(call: Function) {
        if (typeof (this.wx) == "undefined") return;
        let txt = '真是太好玩了,一起来玩吧'
        let url = 'https://download.cocos.com/CocosStore/icon/7374c4a18a774ab7a05b72d5d8e5fed6/7374c4a18a774ab7a05b72d5d8e5fed6.png'
        this.wx.shareAppMessage({
            title: txt,
            imageUrl: url
        })
        //分享成功
        call && call();
    }

    //播放激励视频广告
    showJiLiShiPin() {
        if (!this.videoAd) {
            this.showTip('激励视频未加载成功')
            return
        }
        // 用户触发广告后，显示激励视频广告
        this.videoAd.show().catch(() => {
            // 失败重试
            this.videoAd.load()
                .then(() => this.videoAd.show())
                .catch(err => {
                    console.log('激励视频 广告显示失败')
                })
        })
    }

    //初始化激励视频广告
    initJiLiShiPin() {
        // 创建激励视频广告实例，提前初始化
        this.videoAd = this.wx.createRewardedVideoAd({
            adUnitId: this.idJiLiShiPinAD
        })

        this.videoAd.onLoad(() => {
            console.log('激励视频 广告加载成功')
        })

        this.videoAd.onError(err => {
            console.log(err)
        })

        this.videoAd.onClose(res => {
            // 用户点击了【关闭广告】按钮
            // 小于 2.1.0 的基础库版本，res 是一个 undefined
            if (res && res.isEnded || res === undefined) {
                // 正常播放结束，可以下发游戏奖励
                if (this.numDJ == 0) {
                    this.arrNumDJ[0]++
                    this.shuaXinDJ()
                } else if (this.numDJ == 1) {
                    this.arrNumDJ[1]++
                    this.shuaXinDJ()
                } else if (this.numDJ == 2) {
                    this.arrNumDJ[2]++
                    this.shuaXinDJ()
                } else if (this.numDJ == 3) {
                    this.arrNumDJ[3]++
                    this.shuaXinDJ()
                }
            }
            else {
                // 播放中途退出，不下发游戏奖励
                this.showTip('未观看完整广告，不予奖励！')
            }
        })
    }

    //初始化插屏广告
    initChaPing() {
        // 创建插屏广告实例，提前初始化
        if (this.wx.createInterstitialAd) {
            this.interstitialAd = this.wx.createInterstitialAd({
                adUnitId: this.idChaPingAD
            })
        }
    }

    //初始化Banner广告
    initBannerAD() {
        let { screenWidth } = this.wx.getSystemInfoSync()
        let { screenHeight } = this.wx.getSystemInfoSync()

        this.bannerAd = this.wx.createBannerAd({
            adUnitId: this.idBannerAD,
            style: {
                left: 0,
                top: 0,
                width: 300
            }
        })

        this.bannerAd.onError(err => {
            console.log(err)
        })

        this.bannerAd.onLoad(() => {
            console.log('banner 广告加载成功')
        })

        this.bannerAd.onResize(res => {
            console.log(res.width, res.height)
            console.log(this.bannerAd.style.realWidth, this.bannerAd.style.realHeight)
            this.bannerAd.style.left = (screenWidth - this.bannerAd.style.realWidth) / 2
            this.bannerAd.style.top = screenHeight - this.bannerAd.style.realHeight
        })
    }

    init() {
        this.gameType = 0 //（-1：游戏失败，0：正常游戏，1：游戏通关）
        this.numTouchStart = -1
        this.numTouchEnd = -1

        this.layerOver.active = false
        this.nodeTip.scale = new Vec3(0, 0, 0)

        this.shuaXinLevelInfo()
        this.shuaXinDJ()

        if (this.isEditing) {
            let children = this.parentBlocks.children
            for (let i = 0; i < children.length; i++) {
                let ts_block = children[i].getComponent(block)
                let num_type_random = Math.floor(Math.random() * 30)
                ts_block.init(num_type_random)
            }
        } else {
            this.parentBlocks.removeAllChildren()
            this.crateBlocks()
        }

        this.parentBlocksDi.removeAllChildren()

        this.pddj()
        this.btn3()
    }

    createBlocksEdit() {
        let i_num = 15 //行
        let j_num = 13 //列
        let num_zhongJian = i_num / 2

        for (let i = 0; i < i_num; i++) {
            for (let j = 0; j < j_num; j++) {
                let node_block_edit = instantiate(this.preBlockEdit)
                node_block_edit.parent = this.parentEdit
                node_block_edit.setPosition(i * 40 - (i_num - 1) * 40 / 2, j * 45 - 55, 0)
                if (i_num % 2 == 0) {
                    if (i == num_zhongJian || i == num_zhongJian - 1) {
                        node_block_edit.getComponent(Sprite).color = new Color(255, 0, 0, 98)
                    }
                } else {
                    if (i == Math.floor(num_zhongJian)) {
                        node_block_edit.getComponent(Sprite).color = new Color(255, 0, 0, 98)
                    }
                }

            }
        }
    }

    showTip(str) {
        this.nodeTip.getChildByName('Label').getComponent(Label).string = str
        tween(this.nodeTip)
            .to(0.1, { scale: new Vec3(1, 1, 1) })
            .delay(1.5)
            .to(0.1, { scale: new Vec3(0, 0, 0) })
            .start()
    }

    shuaXinDJ() {
        for (let i = 0; i < this.arrLabelDJ.length; i++) {
            this.arrLabelDJ[i].string = this.arrNumDJ[i]
        }
    }

    shuaXinLevelInfo() {
        let num_level = this.numLevel + 1
        this.labelLevel.string = '第' + num_level + '关'

        if (this.isEditing) {
            if (this.numTypeEdit == 1) {
                this.labelLevel.string = '添加块模式'
            } else {
                this.labelLevel.string = '删除块模式'
            }

            let children = this.parentBlocks.children
            let num_geShu = children.length

            if (num_geShu % 3 == 0) {
                this.labelBlocksInfo.string = '总共有' + num_geShu + '个块，是3的倍数'
                this.labelBlocksInfo.color = new Color(0, 0, 0)
            } else {
                this.labelBlocksInfo.string = '总共有' + num_geShu + '个块，不是3的倍数'
                this.labelBlocksInfo.color = new Color(255, 0, 0)
            }

        }


    }

    crateBlocks() {
        let num_geShu = -1
        let num_type = this.numBlockTypeGeShu + this.numLevel * this.numBlockType
        if (this.gameData.arrTypeLevel[this.numLevel]) {
            num_type = this.gameData.arrTypeLevel[this.numLevel]
        }

        if (num_type > 30) {
            num_type = 30
        }

        let num_type_random = Math.floor(Math.random() * num_type)//5


        if (!this.gameData.arrPosLevel[this.numLevel]) {//随机生成
            let num_block_geShu = this.numBlocksKuaiGeShu + this.numLevel * this.numBlocksKuai

            let arr_v3_block_edit = []
            let children = this.parentEdit.children
            for (let i = 0; i < children.length; i++) {
                if (children[i].name == 'blockEdit') {
                    arr_v3_block_edit.push(children[i].getPosition())
                }
            }

            for (let i = 0; i < num_block_geShu; i++) {
                num_geShu++ //0,1,2,3
                let node_block = instantiate(this.preBlock)//实例化出block
                let xx = -250 + Math.random() * 500
                let yy = -60 + Math.random() * 510

                if (this.numTypeSuiJi == 1) {
                    let i_v3_random = Math.floor(Math.random() * arr_v3_block_edit.length)
                    xx = arr_v3_block_edit[i_v3_random].x
                    yy = arr_v3_block_edit[i_v3_random].y
                } else if (this.numTypeSuiJi == 2 && Math.random() > 0.5) {
                    let i_v3_random = Math.floor(Math.random() * arr_v3_block_edit.length)
                    xx = arr_v3_block_edit[i_v3_random].x
                    yy = arr_v3_block_edit[i_v3_random].y
                }

                node_block.setPosition(xx, yy, 0)
                node_block.parent = this.parentBlocks
                let ts_block = node_block.getComponent(block)

                if (num_geShu % 3 == 0) {
                    num_type_random = Math.floor(Math.random() * num_type)//6,7
                }
                ts_block.init(num_type_random)//6,6,6,7,7,7
            }

            return
        }

        for (let i = 0; i < this.gameData.arrPosLevel[this.numLevel].length; i++) {
            num_geShu++ //0,1,2,3
            let node_block = instantiate(this.preBlock)//实例化出block
            let xx = this.gameData.arrPosLevel[this.numLevel][i].x
            let yy = this.gameData.arrPosLevel[this.numLevel][i].y
            node_block.setPosition(xx, yy, 0)
            node_block.parent = this.parentBlocks
            let ts_block = node_block.getComponent(block)

            if (num_geShu % 3 == 0) {
                num_type_random = Math.floor(Math.random() * num_type)//6,7
            }
            ts_block.init(num_type_random)//6,6,6,7,7,7
        }
    }

    //在底部生成元素块
    createBlockToBi(b_type, v3_block_start) {
        let node_block = instantiate(this.preBlock)//实例化出block
        node_block.parent = this.parentBlocksDi

        let ts_block = node_block.getComponent(block)
        ts_block.initDi(b_type)

        let num_di = this.getNumDi()
        console.log('num_di:' + num_di);
        this.shuaXinNumDi(node_block)

        let xx = this.xxStartDi + 80 * num_di
        //node_block.setPosition(xx,0,0)

        let v3_world = this.parentBlocks.getComponent(UITransform).convertToWorldSpaceAR(v3_block_start)
        let v3_node_di = this.parentBlocksDi.getComponent(UITransform).convertToNodeSpaceAR(v3_world)

        node_block.setPosition(v3_node_di)
        ts_block.v3BlockOld = v3_node_di
        console.log('v3BlockOld:' + ts_block.v3BlockOld);


        tween(node_block)
            .to(0.15, { position: new Vec3(xx, 0, 0) })
            .call(() => {
                this.pdXiaoChu(node_block)
            })
            .start()

    }

    //判断是否可以消除
    pdXiaoChu(node_block) {
        let ts_block = node_block.getComponent(block)
        ts_block.isMoving = false
        let num_di_block = ts_block.numDi
        let children = this.parentBlocksDi.children
        let arr_blockType = []
        for (let i = 0; i < children.length; i++) {
            let ts_block_2 = children[i].getComponent(block)
            if (ts_block.blockType == ts_block_2.blockType && ts_block_2.isXiaoChu == false) {
                arr_blockType.push(children[i])
            }
        }

        let is_xiaoChu = false
        if (arr_blockType.length == 3) {
            for (let i = arr_blockType.length - 1; i >= 0; i--) {
                arr_blockType[i].getComponent(block).isXiaoChu = true
                tween(arr_blockType[i])
                    .delay(0.05)
                    .to(0.08, { scale: new Vec3(0, 0,) })
                    .removeSelf()
                    .start()
                //arr_blockType[i].removeFromParent()
                is_xiaoChu = true
            }
        }

        if (is_xiaoChu) {
            this.audioSource.playOneShot(this.arrAudio[1], 1)
            let children_2 = this.parentBlocksDi.children
            for (let i = 0; i < children_2.length; i++) {
                let ts_block_2 = children_2[i].getComponent(block)
                if (ts_block_2.numDi > num_di_block) {
                    ts_block_2.numDi = ts_block_2.numDi - 3
                    let xx = this.xxStartDi + 80 * ts_block_2.numDi
                    //children_2[i].setPosition(xx,0,0)
                    tween(children_2[i])
                        .delay(0.05)
                        .to(0.08, { position: new Vec3(xx, 0, 0) })
                        .start()
                }
            }
        }

        let num_xiaoChu_geShu = 0
        let children_2 = this.parentBlocksDi.children
        for (let i = 0; i < children_2.length; i++) {
            let ts_block = children_2[i].getComponent(block)
            if (ts_block.isXiaoChu) {
                num_xiaoChu_geShu++
            }
        }

        if (children_2.length - num_xiaoChu_geShu >= 7) {
            this.gameType = -1
            this.audioSource.playOneShot(this.arrAudio[2], 1)
            console.log('游戏失败');

            if (this.interstitialAd) {
                this.interstitialAd.show().catch((err) => {
                    console.error(err)
                })
            }

            this.scheduleOnce(function () {
                this.layerOver.active = true
            }, 0.5)
        }

    }

    //得到在底部的位置
    getNumDi() {
        let children = this.parentBlocksDi.children
        let block_end = children[children.length - 1]
        let ts_block_end = block_end.getComponent(block)
        let num_xiaoChu = 0

        for (let i = 0; i < children.length; i++) {
            let ts_block = children[i].getComponent(block)
            if (ts_block.isXiaoChu) {
                num_xiaoChu++
            }
        }

        if (children.length - num_xiaoChu == 1) {
            ts_block_end.numDi = 0
        }

        for (let i = children.length - 2; i >= 0; i--) {
            let ts_block_2 = children[i].getComponent(block)
            if (ts_block_end.blockType == ts_block_2.blockType && ts_block_2.isXiaoChu == false) {
                ts_block_end.numDi = ts_block_2.numDi + 1
                return ts_block_end.numDi
            }
        }

        ts_block_end.numDi = children.length - 1 - num_xiaoChu

        return ts_block_end.numDi
    }

    //刷新在底部的位置
    shuaXinNumDi(node_block) {
        let num_di = node_block.getComponent(block).numDi
        let children = this.parentBlocksDi.children
        for (let i = 0; i < children.length; i++) {
            let ts_block = children[i].getComponent(block)
            if (node_block.uuid == children[i].uuid || ts_block.isXiaoChu) {
                continue
            }
            if (ts_block.numDi >= num_di) {
                ts_block.numDi++
                let xx = this.xxStartDi + 80 * ts_block.numDi
                tween(children[i])
                    .to(0.1, { position: new Vec3(xx, 0, 0) })
                    .start()
            }
        }
    }

    //判断叠加
    pddj() {
        let children = this.parentBlocks.children
        for (let i = 0; i < children.length; i++) {
            let ts_block_1 = children[i].getComponent(block)
            let rect_1 = ts_block_1.getBoundingBox_pz()
            ts_block_1.setTouch(true)
            for (let j = i + 1; j < children.length; j++) {
                let ts_block_2 = children[j].getComponent(block)
                let rect_2 = ts_block_2.getBoundingBox_pz()

                if (rect_1.intersects(rect_2)) {
                    ts_block_1.setTouch(false)
                    break
                }

            }
        }
    }

    onTouchStart(event: EventTouch) {
        console.log('onTouchStart');

        if (this.gameType != 0) {
            return
        }

        if (this.pdBlockDiMoving()) {
            return
        }

        this.numTouchStart = -1
        let v2_touchStart = event.getUILocation()
        let v3_touchStart = this.parentBlocks.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(v2_touchStart.x, v2_touchStart.y, 0))
        let v3_touchStart_edit = this.parentEdit.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(v2_touchStart.x, v2_touchStart.y, 0))

        if (this.isEditing) {
            if (this.numTypeEdit == 1) {
                let children = this.parentEdit.children
                for (let i = children.length - 1; i >= 0; i--) {

                    let node_UITransform = children[i].getComponent(UITransform)
                    if (node_UITransform.getBoundingBox().contains(new Vec2(v3_touchStart_edit.x, v3_touchStart_edit.y))) {
                        this.numBlockEditMove = i
                        let node_block = instantiate(this.preBlock)
                        node_block.parent = this.parentBlocks
                        node_block.setPosition(children[i].getPosition())
                        let ts_block = node_block.getComponent(block)
                        let num_type_random = Math.floor(Math.random() * 30)
                        ts_block.init(num_type_random)
                        this.shuaXinLevelInfo()
                        this.pddj()
                        break
                    }
                }
            } else if (this.numTypeEdit == 0) {
                let children = this.parentBlocks.children
                for (let i = children.length - 1; i >= 0; i--) {
                    let ts_block = children[i].getComponent(block)
                    // if (ts_block.canTouch == false) {
                    //     continue
                    // }

                    let node_UITransform = children[i].getComponent(UITransform)
                    if (node_UITransform.getBoundingBox().contains(new Vec2(v3_touchStart.x, v3_touchStart.y))) {
                        console.log('点中了：' + i);
                        children[i].removeFromParent()
                        this.shuaXinLevelInfo()
                        this.pddj()
                        break
                    }
                }
            }

            return
        }

        console.log(v2_touchStart)
        console.log(v3_touchStart)

        let children = this.parentBlocks.children
        for (let i = children.length - 1; i >= 0; i--) {
            let ts_block = children[i].getComponent(block)
            if (ts_block.canTouch == false) {
                continue
            }

            let node_UITransform = children[i].getComponent(UITransform)
            if (node_UITransform.getBoundingBox().contains(new Vec2(v3_touchStart.x, v3_touchStart.y))) {
                this.audioSource.playOneShot(this.arrAudio[0], 1)
                this.numTouchStart = i
                console.log('点中了：' + i);
                tween(children[i])
                    .to(0.1, { scale: new Vec3(1.2, 1.2, 1.2) })
                    .start()
                break
            }
        }

    }

    onTouchMove(event: EventTouch) {
        let v2_touchStart = event.getUILocation()
        let v3_touchStart = this.parentBlocks.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(v2_touchStart.x, v2_touchStart.y, 0))
        let v3_touchStart_edit = this.parentEdit.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(v2_touchStart.x, v2_touchStart.y, 0))

        if (this.isEditing) {
            if (this.numTypeEdit == 1) {
                let children = this.parentEdit.children
                for (let i = children.length - 1; i >= 0; i--) {

                    let node_UITransform = children[i].getComponent(UITransform)
                    if (node_UITransform.getBoundingBox().contains(new Vec2(v3_touchStart_edit.x, v3_touchStart_edit.y))) {
                        if (this.numBlockEditMove == i) {
                            return
                        }
                        this.numBlockEditMove = i
                        let node_block = instantiate(this.preBlock)
                        node_block.parent = this.parentBlocks
                        node_block.setPosition(children[i].getPosition())
                        let ts_block = node_block.getComponent(block)
                        let num_type_random = Math.floor(Math.random() * 30)
                        ts_block.init(num_type_random)
                        this.shuaXinLevelInfo()
                        this.pddj()
                        break
                    }
                }
            } else if (this.numTypeEdit == 0) {
                let children = this.parentBlocks.children
                for (let i = children.length - 1; i >= 0; i--) {
                    let ts_block = children[i].getComponent(block)
                    // if (ts_block.canTouch == false) {
                    //     continue
                    // }

                    let node_UITransform = children[i].getComponent(UITransform)
                    if (node_UITransform.getBoundingBox().contains(new Vec2(v3_touchStart.x, v3_touchStart.y))) {
                        console.log('点中了：' + i);
                        children[i].removeFromParent()
                        this.shuaXinLevelInfo()
                        this.pddj()
                        break
                    }
                }
            }

            return
        }
    }

    onTouchEnd(event: EventTouch) {
        console.log('onTouchEnd');

        if (this.isEditing) {
            return
        }

        if (this.gameType != 0) {
            return
        }

        if (this.pdBlockDiMoving()) {
            return
        }

        let v2_touchStart = event.getUILocation()
        let v3_touchStart = this.parentBlocks.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(v2_touchStart.x, v2_touchStart.y, 0))

        let children = this.parentBlocks.children
        for (let i = children.length - 1; i >= 0; i--) {
            let ts_block = children[i].getComponent(block)
            if (ts_block.canTouch == false) {
                continue
            }

            let node_UITransform = children[i].getComponent(UITransform)
            if (node_UITransform.getBoundingBox().contains(new Vec2(v3_touchStart.x, v3_touchStart.y))) {
                this.numTouchEnd = i
                console.log('确认点中了：' + i);
                if (this.numTouchStart == this.numTouchEnd) {
                    let ts_block_1 = children[i].getComponent(block)
                    let block_type = ts_block_1.blockType
                    this.createBlockToBi(block_type, children[i].getPosition())
                    children[i].removeFromParent()
                    this.pddj()
                    break
                }
            }
        }

        if (this.numTouchStart != -1) {
            tween(children[this.numTouchStart])
                .to(0.1, { scale: new Vec3(1., 1, 1) })
                .start()
        }

        let children_1 = this.parentBlocks.children
        if (children_1.length == 0) {
            this.gameType = 1
            this.audioSource.playOneShot(this.arrAudio[3], 1)
            console.log('游戏通关');
            this.numLevel++

            if (this.interstitialAd) {
                this.interstitialAd.show().catch((err) => {
                    console.error(err)
                })
            }

            this.scheduleOnce(function () {
                this.init()
            }, 1)

        }

    }

    pdBlockDiMoving() {
        let is_moving = false
        let children = this.parentBlocksDi.children
        if (children.length > 0) {
            let ts_block = children[children.length - 1].getComponent(block)
            is_moving = ts_block.isMoving
        }
        return is_moving
    }

    //按钮回调
    callBackBtn(event: Event, str: string) {
        if (str == 'btn_3') {//洗牌按钮
            if (this.arrNumDJ[2] <= 0) {
                if (this.isWX) {
                    this.numDJ = 2
                    this.showJiLiShiPin()
                } else {
                    this.showTip('该道具数量为0')
                }
                return
            }
            this.arrNumDJ[2]--
            this.shuaXinDJ()
            this.btn3()
        } else if (str == 'btn_shuChu') {
            this.shuChuPosBlocks()
        } else if (str == 'btn_1') {//出去3个块
            if (this.arrNumDJ[0] <= 0) {
                if (this.isWX) {
                    this.numDJ = 0
                    this.showJiLiShiPin()
                } else {
                    this.showTip('该道具数量为0')
                }
                return
            }
            this.arrNumDJ[0]--
            this.btn1()
            this.shuaXinDJ()
        } else if (str == 'btn_2') {//撤回
            if (this.arrNumDJ[1] <= 0) {
                if (this.isWX) {
                    let call = () => {
                        this.arrNumDJ[1]++
                        this.shuaXinDJ()
                        console.log("分享成功");
                    }
                    this.shareFirend(call)
                } else {
                    this.showTip('该道具数量为0')
                }
                return
            }
            this.arrNumDJ[1]--
            this.btn2()
            this.shuaXinDJ()
        } else if (str == 'btn_fh') {
            if (this.arrNumDJ[3] <= 0) {
                if (this.isWX) {
                    this.numDJ = 3
                    this.showJiLiShiPin()
                } else {
                    this.showTip('该道具数量为0')
                }
                return
            }
            this.arrNumDJ[3]--
            this.shuaXinDJ()
            this.gameType = 0
            this.layerOver.active = false
            this.btn1()
        } else if (str == 'btn_cw') {
            this.numLevel = 0
            this.init()
        } else if (str == 'btn_yin') {
            let children = this.parentEdit.children
            for (let i = 0; i < children.length; i++) {
                if (children[i].name == 'blockEdit') {
                    children[i].active = !children[i].active
                }
            }
        } else if (str == 'btn_qingKong') {
            this.parentBlocks.removeAllChildren()
            this.shuaXinLevelInfo()
        } else if (str == 'btn_jia') {
            this.numTypeEdit = 1
            this.shuaXinLevelInfo()
        } else if (str == 'btn_jian') {
            this.numTypeEdit = 0
            this.shuaXinLevelInfo()
        } else if (str == 'btn_suiJi') {

            let arr_v3_block_edit = []
            let children = this.parentEdit.children
            for (let i = 0; i < children.length; i++) {
                if (children[i].name == 'blockEdit') {
                    arr_v3_block_edit.push(children[i].getPosition())
                }
            }

            for (let i = 0; i < this.numSuiJi; i++) {
                let node_block = instantiate(this.preBlock)
                node_block.parent = this.parentBlocks
                let i_v3_random = Math.floor(Math.random() * arr_v3_block_edit.length)
                node_block.setPosition(arr_v3_block_edit[i_v3_random])
                let ts_block = node_block.getComponent(block)
                ts_block.init(Math.floor(Math.random() * 30))
            }

            this.shuaXinLevelInfo()
            this.pddj()
        }
    }

    //撤回
    btn2() {
        let children = this.parentBlocksDi.children
        let i_end = -1
        for (let i = children.length - 1; i >= 0; i--) {
            let ts_block = children[i].getComponent(block)
            if (ts_block.isXiaoChu) {
                continue
            }
            i_end = i
            break
        }

        let num_di_cheHui = -1

        if (i_end != -1) {
            let ts_block = children[i_end].getComponent(block)
            num_di_cheHui = ts_block.numDi
            ts_block.isXiaoChu = true

            let v3_old = ts_block.v3BlockOld
            let v3_world = this.parentBlocksDi.getComponent(UITransform).convertToWorldSpaceAR(v3_old)
            let v3_block = this.parentBlocks.getComponent(UITransform).convertToNodeSpaceAR(v3_world)

            tween(children[i_end])
                .to(0.1, { position: v3_old })
                .call(() => {
                    let node_block = instantiate(this.preBlock)
                    node_block.parent = this.parentBlocks
                    node_block.setPosition(v3_block)
                    node_block.getComponent(block).init(ts_block.blockType)
                    this.pddj()
                })
                .removeSelf()
                .start()
        }

        if (num_di_cheHui == -1) {
            this.arrNumDJ[1]++
            this.showTip('当前不可用该道具')
        }

        let children_di_2 = this.parentBlocksDi.children
        for (let i = 0; i < children_di_2.length; i++) {

            let ts_block = children_di_2[i].getComponent(block)
            if (ts_block.isXiaoChu) {
                continue
            }
            if (ts_block.numDi > num_di_cheHui && num_di_cheHui != -1) {
                ts_block.numDi = ts_block.numDi - 1
                let xx = this.xxStartDi + 80 * ts_block.numDi
                tween(children_di_2[i])
                    .to(0.08, { position: new Vec3(xx, 0, 0) })
                    .start()
            }

        }

    }

    //出去3个块
    btn1() {
        let arr_block_di = []
        let children_di_1 = this.parentBlocksDi.children
        for (let i = 0; i < children_di_1.length; i++) {
            let ts_block = children_di_1[i].getComponent(block)
            if (ts_block.numDi < 3 && ts_block.isXiaoChu == false) {
                arr_block_di.push(children_di_1[i])
            }
        }

        let num_geShu = arr_block_di.length

        if (num_geShu == 0) {
            this.arrNumDJ[0]++
            this.showTip('当前不可用该道具')
        }

        for (let i = arr_block_di.length - 1; i >= 0; i--) {

            let ts_block = arr_block_di[i].getComponent(block)

            let v3_block_di = new Vec3(-80 + ts_block.numDi * 80, this.yyBlockChu, 0)
            let v3_world = this.parentBlocksDi.getComponent(UITransform).convertToWorldSpaceAR(v3_block_di)
            let v3_block = this.parentBlocks.getComponent(UITransform).convertToNodeSpaceAR(v3_world)

            ts_block.isXiaoChu = true
            tween(arr_block_di[i])
                .to(0.1, { position: v3_block_di })
                .call(() => {
                    let node_block = instantiate(this.preBlock)
                    node_block.parent = this.parentBlocks
                    node_block.setPosition(v3_block)
                    node_block.getComponent(block).init(ts_block.blockType)
                    this.pddj()
                    console.log('v3_block:' + v3_block);
                })
                .removeSelf()
                .start()

            //arr_block_di[i].removeFromParent()
        }

        let children_di_2 = this.parentBlocksDi.children
        for (let i = 0; i < children_di_2.length; i++) {

            let ts_block = children_di_2[i].getComponent(block)
            if (ts_block.isXiaoChu) {
                continue
            }
            ts_block.numDi = ts_block.numDi - num_geShu
            let xx = this.xxStartDi + 80 * ts_block.numDi
            tween(children_di_2[i])
                .to(0.08, { position: new Vec3(xx, 0, 0) })
                .start()

        }

    }

    //洗牌功能
    btn3() {
        let children = this.parentBlocks.children
        for (let i = 0; i < children.length; i++) {
            let ts_1 = children[i].getComponent(block)
            let i_random = Math.floor(Math.random() * children.length)
            let ts_2 = children[i_random].getComponent(block)

            let type_1 = ts_1.blockType
            let type_2 = ts_2.blockType

            ts_1.shuaXinBlockSPF(type_2)
            ts_2.shuaXinBlockSPF(type_1)

        }
    }

    //输出所有元素块的坐标
    shuChuPosBlocks() {
        let str_pos = ''
        let children = this.parentBlocks.children
        for (let i = 0; i < children.length; i++) {
            let v3_block = children[i].getPosition()
            str_pos = str_pos + '{x:' + v3_block.x + ',y:' + v3_block.y + '},'
        }
        if (children.length % 3 == 0) {
            if (children.length > 0) {
                console.log(str_pos);
                this.copyToClipBoard(str_pos)
            } else {
                console.log('块的个数为0，无效');
                this.showTip('块的个数为0，无效')
            }
        } else {
            console.log('块的个数不是3的倍数，无效');
            this.showTip('块的个数不是3的倍数，无效')
        }

    }

    copyToClipBoard(str): boolean {
        if (sys.isNative) {
            //原生自己实现
        } else if (sys.isBrowser) {
            var textarea = document.createElement("textarea");
            textarea.textContent = str;
            document.body.appendChild(textarea);
            textarea.readOnly = true;
            textarea.select();
            textarea.setSelectionRange(0, textarea.textContent.length);
            try {
                const flag = document.execCommand('copy');
                document.body.removeChild(textarea);
                if (flag) {
                    this.showTip('复制数据成功！')
                    console.log('复制数据成功！')
                    return true;
                } else {
                    this.showTip('复制失败！')
                    console.log('复制失败！')
                    return false;
                }
            } catch (err) {
                this.showTip('复制失败！')
                console.log('复制失败！')
                return false;
            }
        }
    }


    update(deltaTime: number) {//每分钟执行60次

    }
}

