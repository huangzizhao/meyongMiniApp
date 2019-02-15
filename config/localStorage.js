class LocalStorage {
	constructor() {
		// super()
		this.storage = {
			/**
			 * @description 读取本地存储，
			 * @param { string } 要读取的key
			 * @param {boolean} 是否是同步
			 * @todo 赌气本地存储，判断key只能是string且非纯空格 如果不是将报错，
			 */
			Get: function (key, isSync = false) {
				if (typeof key != "string") {
					throw new Error("key is typeof string at LocalStorage.storage.Get");
					return false;
				}
				if (key.Trim() == "") {
					throw new Error("key is not null at LocalStorage.storage.Get");
					return false;
				}
				return new Promise((resolve, reject) => {
					if (isSync) {
						let result = wx.getStorageSync(key.Trim());
						if (result != "") {
							resolve(result);
						} else {
							reject("getStorage:fail data not found");
						}
					} else {
						wx.getStorage({
							key: key.Trim(),
							success: function (res) {
								let result = res.data;
								resolve(result)
							},
							fail(error) {
								reject(error.errMsg);
							}
						})
					}
				})
			},
			/**
			 * @description 设置本地存储，
			 * @param { string } 存储的key
			 * @param { * } 存储的内容
			 * @param {boolean} 是否是同步
			 * @todo 设置本地存储，判断key只能是string且非纯空格 如果不是将报错，
			 */
			Set: function (key, data, isSync = false) {
				if (typeof key != "string") {
					throw new Error("key is typeof string at LocalStorage.storage.Set");
					return false;
				}
				if (key.Trim() == "") {
					throw new Error("key is not null at LocalStorage.storage.Set");
					return false;
				}
				return new Promise((resolve, reject) => {
					if (isSync) {
						wx.setStorageSync(key.Trim(), data)
						resolve({
							errMsg: "storage okey",
						});
					} else {
						wx.setStorage({
							key: key.Trim(),
							data,
							success: function (res) {
								resolve({
									errMsg: "storage okey",
								})
							},
						})
					}
				})
			},
			/**
			 * @description 清理本地存储，
			 * @param { string } 存储的key（为空将清空所有）
			 * @param {boolean} 是否是同步
			 * @todo 清理本地存储，如果key为空则清空所有，如果key不为空则清空指定的key
			 */
			Remove: function (key = "", isSync = false) {
				if (typeof key != "string") {
					throw new Error("key is typeof string at LocalStorage.storage.Remove");
					return false;
				}
				return new Promise((resolve, reject) => {
					if (key == "") {
						if (isSync) {
							wx.clearStorage({
								success() {
									resolve({
										errMsg: "clearStorage is okey"
									})
								}
							})
						} else {
							wx.clearStorageSync();
							resolve({
								errMsg: "clearStorage is okey"
							})
						}
					} else {
						if (!isSync) {
							wx.removeStorage({
								key: key.Trim(),
								success() {
									resolve({
										errMsg: "clearStorage is okey"
									})
								}
							})
						} else {
							wx.removeStorage(key.Trim());
							resolve({
								errMsg: "clearStorage is okey"
							})
						}
					}
				})
			}
		}
	}
}
/**
 * @public
 * @author jinzhenzong
 * @description 为string新增方法，trim为string去掉两端空格
 */
String.prototype.Trim = function () {
	return this.replace(/(^\s*)|(\s*$)/g, "");
}
export {
	LocalStorage
}