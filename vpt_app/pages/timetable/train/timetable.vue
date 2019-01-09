<template>
	<view class="content uni-column" style="flex: 1;">
		<view class="header-box">
			<view @tap="gotoLineSelect">{{trainLines}}</view>
			<view @tap="gotoStopSelect">Box Hill</view>
		</view>

		<scroll-view scroll-y style="height: 1000upx;" class="uni-list">
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,index) in timetables" :key="index" @tap="openRunDetail"
			 :data-runid="item.runId">
				<view class="uni-list-cell-navigate uni-navigate-right" style="flex-direction: column;align-items: flex-start;">
					<view style="align-items:center">
						<view class="disruption-circle good"></view>
						<text style="font-size:1.2em;padding-left: 15upx;font-weight:bold;text-transform: uppercase;">{{item.terminal}}</text>
						<text v-show="item.express"> - Express</text>
					</view>
					<view style="padding-top: 10upx;font-size: 33upx;font-weight: 700;color:#8F8F94">
						{{item.departureLocalTime}} - Platform {{item.platform}}
						<text v-if="item.gap > 0">&nbsp;&nbsp;in {{item.gapText}} mins</text>
						<text v-else-if="item.gap < 0">&nbsp;&nbsp;left {{item.gapText}} mins ago</text>
						<text v-else>&nbsp;&nbsp;NOW</text>
					</view>
				</view>
			</view>
		</scroll-view>

	</view>
</template>

<script>
	import net from '@/common/js/netUtil.js'
	import con from '@/common/js/constant.js'
	import moment from '@/common/js/moment.min.js'

	export default {
		data() {
			return {
				timetables: [],
				trainLines: '',
			};
		},

		onLoad: function() {
			let ids = uni.getStorageSync("selectedRouteIds")
			if(ids ==null || ids.length == 0) {
				this.gotoTrainlines();
			}
		},

		onShow: function() {
			this.loadRoute();
			let routeIds = uni.getStorageSync("selectedRouteIds");
			if (routeIds.length == 1) {
				let trainRoutesMap = uni.getStorageSync("trainRoutesMap");
				this.trainLines = trainRoutesMap[routeIds[0]];

			} else if (routeIds.length > 1) {
				this.trainLines = routeIds.length + " lines"
			}
		},

		methods: {
			loadRoute() {
				// 				let stopId = uni.getStorageSync("stop");
				// 				let routeType = uni.getStorageSync("routeType");
				
				let body = {
					routeType: '0',
					stopId: '1071',
					routeIds: uni.getStorageSync("selectedRouteIds").join()
				}
				net.netUtil(con.DEPARTURE_URL, 'GET', body, ret => {
					if (ret) {
						this.timetables = this.filterTheTimetable(ret);
					}
				});
			},

			filterTheTimetable(timetables) {
				return timetables.filter(item => {
					if (moment(item.departureUTCTime).isAfter(moment.utc().subtract(15, 'minutes'))) {
						item.gap = moment(item.departureUTCTime).diff(moment(), 'minutes');
						item.gapText = Math.abs(item.gap);
						return item;
					}
				})
			},

			openRunDetail(e) {
				var runid = e.currentTarget.dataset.runid;
				uni.navigateTo({
					url: './runDetail/runDetail?runId=' + runid
				});
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
		padding: 20upx;
		justify-content: space-around;
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
