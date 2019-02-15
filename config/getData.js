import {
    get,
    post
} from '../config/http.js';

//全局请求
export const getPurchaseInformation = (params) => {
    return get('qActivity/purchaseInformation', params);
}
/**查询是否有中奖信息 */
export const getObtainNearestActivityInfo = (params) => {
    return get('qActivity/obtainNearestActivityInfo', params);
}
/**由订单进来的产品详情 获取购买信息 */
export const getPurchaseInfoByOrderId = (params) => {
    return get('qpActivity/prizeDetail/' + params);
}
/**查询是否订单成交状态 */
export const queryOrderState = (params) => {
    return get('/pay/queryOrderState?orderCode=' + params);
}
/**获取当前活动详情 */
export const getActivityInfo = (activityId) => {
    return get('qActivity/qActivityInfo/' + activityId);
}

/**提交商品数据埋点 */
export const postProductDataBuried = (params) => {
    return post('/customer/recordScanPage', params);
}


//binding-phone 绑定手机->
/**发送短信验证码*/
export const sendVerificationCode = (params) => {
    return get('customer/sendVerificationCode', params);
}
/**绑定手机 */
export const bindMobile = (params) => {
    return get('customer/bindMobile', params);
}

//home -> 
/**通过谁分享推荐进入本小程序**/
export const getBindRecommendUser = (params) => {
    return get('customer/bindRecommendUser', params);
}
/**瀑布流数据获取 */
export const getWaterFallFlow = (params) => {
    return post('article/recommend', params);
}

//article-detail

/**获取文章内容 */
export const getArticleById = (params) => {
    return get('article/getArticleById', params);
}
/**将腾讯视频包含vid的播放地址发送至此并转换成 特殊字符串*/
export const changeUrlString = (params) => {
    return post('forward/forwarding', params);
}
/**将特殊字符串 转换成播放地址 */
export const toVideoUrls = (params) => {
    return post('forward/forwarding', params);
}
/**点赞 */
export const upThumb = (params) => {
    return get('article/upThumb', params);
}
/**评论 */
export const review = (params) => {
    return post('article/review', params);
}
/**获取评论列表 */
export const getReviewList = (params) => {
    return get('article/listReview', params);
}

//notification ->
export const getListQActivities = (params) => {
    return get('qActivity/listQActivities', params);
}

//groupPurchase ->
/**是否在当前拼团组里面 */
export const isCurrentInGroup = (groupId) => {
    return get('qpActivity/isCurrentInGroup/' + groupId);
}
/**可拼团列表 */
export const getSpliceGroupList = (params) => {
    return get('qpActivity/listProcessingGroup', params);
}

//mutiplayerPlayerGroupChase ->
/** 由活动列表活动详情获取的 获取购买信息 */
export const getPurchaseInfoByActivityId = (params) => {
    return get('qActivity/qActivityInfo/' + params);
}
/**获取更多拼团项目 */
export const getMorePrizes = (params) => {
    return get('qpActivity/morePrizes/' + params);
}

//bargain ->
/**查询是否为已经砍过价 */
export const isBargainOrder = (params) => {
    return get('qpActivity/isBargainOrder/' + params);
}
/**进行砍价 */
export const bargainOrder = (params) => {
    return get('qpActivity/bargainOrder/' + params);
}
/**获取好友帮忙砍价列表 */
export const getBargainList = (params) => {
    return get('qpActivity/listBargain/' + params);
}

//person-center ->
/**获取是否有系统通知 */
export const hasUnReadNotice = (params) => {
    return get('qActivity/hasUnReadNotice', params);
}

//wallet ->
export const getObtainCustomerBill = (params) => {
    return get('customer/obtainCustomerBill?radom=' + params);
}

//coupon ->
/**获取优惠券列表 */
export const getLotteryList = (params) => {
    return get('activity/lotteryList', params);
}

//orderList ->
/**获取订单数据 */
export const getListOrders = (params) => {
    return get('qActivity/listOrders', params);
}

//currentOrderInfo ->
/**拼团订单支付 */
export const payQGOrder = (params) => {
    return post('pay/payQGOrder', params);
}
/**团购订单支付 */
export const payQPOrder = (params) => {
    return post('qpActivity/payQPOrder', params);
}
/**获取活动ID 由订单进入活动详情 */
export const getActivityIdByPrize = (params) => {
    return get('/qpActivity/getActivityIdByPrize/' + params);
}

//subscription 预约金列表->
/**获取预约金列表 */
export const getProjects = (params) => {
    return get('project/getProjects', params);
}

//pay 预约金支付详情->
/** 预约金支付*/
export const payAppointmentGold = (params) => {
    return post('/pay/pay', params);
}

//systemNotification ->
/**获取系统通知列表 */
export const getSystemNotification = (params) => {
    return get('qActivity/listNotices', params);
}
/**单条通知已读 */
export const singleNoticeHaveRead = (params) => {
    return get('qActivity/listNotice', params);
}
/**全部通知已读 */
export const allNoticeHaveRead = (params) => {
    return get('qActivity/listNotices', params);
}

//winnerAnnouncement ->
/**获取中奖者名单 */
export const getObtainNearestWinDetail = (params) => {
    return get('qActivity/obtainNearestWinDetail', params);
}

//beforeMultiplayerGroupPurchasePay 多人拼团各种情况支付->
/**创建多人团 */
export const createOrderTeam = (params) => {
    return get('qpActivity/createOrderTeam', params);
}

/**组多人团 */
export const fightGroup = (params) => {
    return post('qpActivity/fightGroup', params);
}