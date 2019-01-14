<template>
	<view class="content uni-column" style="flex: 1;">
		<!-- <view>
			<uni-drawer :visible="showDrawer" mode="left" @close="closeDrawer">
				<uni-list>
					<uni-list-item title="Item1"></uni-list-item>
					<uni-list-item title="Item2"></uni-list-item>
					<uni-list-item title="Item3" show-badge="true" badge-text="12"></uni-list-item>
				</uni-list>
			</uni-drawer>
		</view> -->
		<view class="header-box">
			<!-- <view @tap="openDrawer">
				<image style="width:25px;height:25px" src="../../../static/images/drawer.png"></image>
			</view> -->
			<view @tap="gotoLineSelect">
				<image style="width:25px;height:25px" src="../../../static/images/track.png"></image>
				<text>{{trainLines}}</text>
			</view>
			<view @tap="gotoStopSelect">
				<image style="width:25px;height:25px" src="../../../static/images/stop.png"></image>
				<text>{{stopName}}</text>
			</view>
			<picker @change="pickDirection" :range="directionArr">
				<image style="display:flex;width:25px;height:25px" src="../../../static/images/filter.png"></image>
			</picker>
		</view>
		<view style="position: fixed;margin-top:50px;margin-bottom:200uxp;width:100%;">
			<view scroll-y :style="scrollHeight" class="uni-list">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,index) in timetables" :key="index" @tap="openRunDetail"
				 :data-runid="item.runId" :data-terminal="item.terminal" :data-routeid="item.routeId" :data-departtime="item.departureLocalTime">
					<view class="uni-list-cell-navigate uni-navigate-right" style="flex-direction: column;align-items: flex-start;">
						<view style="align-items:center">
							<view class="disruption-circle good"></view>
							<text style="font-size:1.2em;padding-left: 15upx;font-weight:bold;text-transform: uppercase;">{{item.terminal}}</text>
							<text v-show="item.express"> - Express</text>
						</view>
						<view style="padding-top: 10upx;font-size: 33upx;font-weight: 700;color:#8F8F94">
							{{item.departureLocalTime}} - Platform {{item.platform}}
							<text v-if="item.gap > 0">&nbsp;&nbsp;In {{item.gapText}}m</text>
							<text v-else-if="item.gap < 0">&nbsp;&nbsp;Left {{item.gapText}}m ago</text>
							<text v-else>&nbsp;&nbsp;NOW</text>
						</view>
					</view>
				</view>
			</view> <!--scroll-view -->
		</view>
	</view>
</template>

<script>
	import net from '@/common/js/netUtil.js'
	import con from '@/common/js/constant.js'
	import moment from '@/common/js/moment.min.js'
	import uniDrawer from "@/components/uni-drawer/uni-drawer.vue"

	export default {

		components: {
			uniDrawer
		},

		data() {
			return {
				showDrawer: false,
				fullTimetables: [],
				timetables: [],
				trainLines: '',
				stopName: '',
				stopId: '',
				trainRoutesMap: [],
				directionIndex: 0,
				scrollHeight: "1000upx",
				directionArr: [],
				directionIds: [],
				index: 0,
			};
		},

		onLoad: function() {
			console.log('timetable on load');
			// 			let ids = uni.getStorageSync("selectedRouteIds")
			// 			if (!ids) {
			// 				this.gotoLineSelect();
			// 			}
		},

		onReady: function() {
			wx.getSystemInfo({
				success: (res) => {
					console.info("on ready height:" + res.windowHeight);
					//#ifdef APP-PLUS
					this.scrollHeight = "height:" + (res.windowHeight - 100) + "px";
					//#endif
					//#ifdef MP-WEIXIN
					this.scrollHeight = "height:" + (res.windowHeight - 50) + "px";
					//#endif
				}
			})
		},

		onShow: function() {
			this.trainRoutesMap = uni.getStorageSync("trainRoutesMap");
			this.initDefaultStop();
			let routeIds = uni.getStorageSync("selectedRouteIds");
			if (routeIds) {
				this.loadTimetable();
				if (routeIds.length == 1) {
					this.trainLines = this.trainRoutesMap[routeIds[0]];
				} else if (routeIds.length > 1) {
					this.trainLines = routeIds.length + " lines"
				}
			}

		},

		onPullDownRefresh() {
			this.forceLoadingTimetable(uni.stopPullDownRefresh());
		},

		methods: {
			loadTimetable() {
				this.fullTimetables = uni.getStorageSync("fullTimetables");
				if (!this.fullTimetables) {
					this.forceLoadingTimetable();
				}
			},

			forceLoadingTimetable(callback) {
				console.log("refresh the timetable");
				let body = {
					routeType: '0',
					stopId: this.stopId,
					routeIds: uni.getStorageSync("selectedRouteIds").join()
				}
				net.netUtil(con.DEPARTURE_URL, 'GET', body, ret => {
					if (ret) {
						this.fullTimetables = this.filterTheTimetable(ret);
						this.timetables = this.fullTimetables;
						uni.setStorageSync("fullTimetables", this.fullTimetables);
						uni.setStorageSync("timetables", this.timetables);
						this.initDirections(this.timetables);

						if (callback) {
							callback();
						}
					}
				});
			},

			initDefaultStop() {
				let selectedStop = uni.getStorageSync("selectedStop");
				if (selectedStop) {
					this.stopName = selectedStop['stopName'];
					this.stopId = selectedStop['stopId'];
				} else {
					//第一次进入, 使用gps最近的车站
					let nearme = uni.getStorageSync("nearMeStops");
					if (nearme) {
						this.stopName = nearme[0];
						this.stopId = uni.getStorageSync('stopNameMap')[this.stopName];
					} else {
						this.stopName = "Flinders Street";
						this.stopId = "1071";
					}
				}
			},

			filterTheTimetable(timetables) {
				return timetables.filter(item => {
					if (moment(item.departureUTCTime).isAfter(moment.utc().subtract(10, 'minutes'))) {
						let du = moment.duration(moment(item.departureUTCTime) - moment(), 'ms');
						item.gap = moment(item.departureUTCTime).diff(moment(), 'minutes');
						var h = "";
						if (du.get('hours') > 0) {
							h = du.get('hours') + "h"
						}
						item.gapText = h + Math.abs(du.get('minutes')); //Math.abs(item.gap);
						return item;
					}
				})
			},

			openRunDetail(e) {
				let dataset = e.currentTarget.dataset;
				let runId = dataset.runid;
				let terminal = dataset.terminal;
				let departTime = dataset.departtime;
				let routeId = dataset.routeid;
				let line = this.trainRoutesMap[routeId];
				uni.navigateTo({
					url: './runDetail/runDetail?runId=' + runId + '&terminal=' + terminal + '&line=' + line + '&departTime=' +
						departTime
				});
			},

			initDirections(timetables) {
				this.directionArr = [];
				this.directionIds = [];
				this.directionArr.push("All");
				this.directionIds.push("888");
				this.timetables.forEach(run => {
					if (this.directionIds.indexOf(run.directionId) == -1) {
						this.directionIds.push(run.directionId);
					}
				})

				let directions = uni.getStorageSync("directions");
				if (this.directionIds && directions) {
					this.directionIds.forEach(d => {
						if (d != 888) {
							this.directionArr.push(directions[d]);
						}
					})
				}
			},

			pickDirection(e) {
				let index = e.target.value;
				if (this.directionIds[index] == 888) {
					this.timetables = this.fullTimetables;
				} else {
					this.timetables = this.fullTimetables.filter(t => t.directionId == this.directionIds[index]);
				}
			},

			changeDirection() {
				let directions = uni.getStorageSync("directions");
				if (directions) {
					let totalSize = directions.length;
					if (this.directionIndex == totalSize) {
						this.directionIndex = 0;
						this.timetables = this.fullTimetables;
					} else {
						this.timetables = this.fullTimetables.filter(t => t.directionId == directions[this.directionIndex]);
						this.directionIndex++;
					}
					uni.setStorageSync("timetables", this.timetables);
				}
			},

			openDrawer(e) {
				this.showDrawer = true;
			},
			closeDrawer() {
				console.info("close drawer:" + this.showDrawer);
				this.showDrawer = false;
			},

			gotoLineSelect() {
				uni.navigateTo({
					url: './lineSelect/lineSelect'
				})
			},

			gotoStopSelect() {
				uni.navigateTo({
					url: './stopSelect/stopSelect'
				})
			}

		}
	}
</script>

<style>
	.uni-media-list-body {
		height: auto;
	}

	.uni-media-list-text-top {
		line-height: 1.6em;
	}

	.header-box {
		width: 100%;
		display: flex;
		justify-content: space-around;
		align-items: center;
		height: 50px;
		background-color: #0072ce;
		color: white;
		font-weight: bold;
	}

	.header-box text {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width:auto;
	}

	.good {
		background-color: #66cc33;
	}

	.warning {
		background-color: #ffd500;
	}

	.disruption-circle {
		height: 25upx;
		width: 25upx;
		border-radius: 50%;
		display: inline-block;
	}
</style>
