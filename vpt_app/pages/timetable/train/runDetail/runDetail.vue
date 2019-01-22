<template>
	<view class="content" style="flex: 1;flex-direction: column;width:100%;">
		<view style="flex-direction:column">
			<!-- <view class="uni-list-cell" v-for="(item,index) in descriptions" :key="index">
				<uni-notice-bar show-icon="true" :text="item">
				</uni-notice-bar>
			</view> -->
		</view>
		<view class="header-box">
			<view style="justify-content:space-between;font-size:16px;">
				<view>{{line}} Line</view>
				<view style="align-items: center;">
					<text style="padding-right: 10upx;">{{status}}</text>
					<view class="disruption-circle" :style="statusColor"></view>
				</view>
			</view>
			<view style="justify-content:space-between;font-size:1em;font-weight:bold;text-transform: uppercase;">
				<view>{{terminal}}</view>
				<view>{{departTime}}</view>
			</view>
		</view>

		<view style="flex-direction: column;">
			<scroll-view scroll-y :style="scrollHeight" class="uni-list">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,index) in stops" :key="index" @tap="openStop"
				 :data-stopId="item.stopId">
					<view class="uni-list-cell-navigate uni-navigate-right" style="flex-direction: column;align-items: flex-start;">
						<span v-if="item.stopId != 0">
							<view style="align-items:center">
								<text style="font-size:1em;padding-left:10upx;font-weight:bold;">{{item.stopName}}</text>
							</view>
							<view style="padding-top: 8upx;font-size: 33upx;font-weight: 700;color:#8F8F94">
								{{item.departureLocalTime}} - {{item.gapText}} mins travel time
							</view>
						</span>
						<view sytle='height:70px' v-else>
							<text style="font-size:1em;padding:20upx;font-weight:bold;">-------</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- <scroll-view scroll-y  class="main_container">
			<view class="container" hover-class="uni-list-cell-hover" v-for="(item,index) in stops" :key="index" @tap="openStop"
			 :data-stopId="item.stopId">
				<view class="uni-list-cell-navigate uni-navigate-right" style="flex-direction: column;align-items: flex-start;">
					<view style="align-items:center">
						<text style="font-size:1em;padding-left:10upx;font-weight:bold;text-transform: uppercase;">{{item.stopName}}</text>
					</view>
					<view style="padding-top: 8upx;font-size: 33upx;font-weight: 700;color:#8F8F94">
						{{item.departureLocalTime}} - {{item.gapText}} mins travel time
					</view>
				</view>
			</view>
		</scroll-view> -->

	</view>
</template>

<script>
	import net from '@/common/js/netUtil.js'
	import con from '@/common/js/constant.js'
	import moment from '@/common/js/moment.min.js'
	import uniNoticeBar from "@/components/uni-notice-bar/uni-notice-bar.vue"

	export default {
		components: {
			uniNoticeBar
		},
		data() {
			return {
				stops: [],
				trainRoutesMap: uni.getStorageSync("trainRoutesMap"),
				line: '',
				terminal: '',
				departTime: '',
				scrollHeight: "height:1000px",
				status: 'Good Service',
				statusColor: 'background-color:#66cc33',
				descriptions: [],

			};
		},

		onLoad: function(e) {

			this.terminal = e.terminal;
			this.line = e.line;
			this.departTime = e.departTime;
			let body = {
				routeType: '0',
				runId: e.runId
			}
			net.netUtil(con.STOP_URL, 'GET', body, ret => {
				if (ret) {
					let stopId = uni.getStorageSync("selectedStop")['stopId'];
					let selectedDepartureUTCTime = ret.filter(stop => stop.stopId == stopId)[0].departureUTCTime;

					this.stops = ret.filter(stop => {
						//if (stop.stopId == 0) return stop;
						var m1 = moment(stop.departureUTCTime),
							m2 = moment(selectedDepartureUTCTime),
							du = moment.duration(m1 - m2, 'ms').get('minutes');
						if (du > 0) {
							stop.gapText = du;
							return stop;
						}
					});
				}
			});

			let disruptions = uni.getStorageSync("disruptions");
			if (disruptions) {
				let disruption = disruptions.filter(d => d.routeId == e.routeId);
				if (disruption.length > 0) {
					this.status = disruption[0].type;
					this.statusColor = "background-color:" + disruption[0].colour;
					this.descriptions = disruption[0].descriptions;
				}
			}

			uni.setNavigationBarTitle({
				title: e.stop + ' Station'
			});

		},
		onReady: function() {
			wx.getSystemInfo({
				success: (res) => {
					this.scrollHeight = "height:" + (res.windowHeight-80) + "px";
				}
			})
		},
		methods: {

		}
	}
</script>

<style>
	.main_container {
		position: relative;
		width: 750rpx;
		height: 100vh;
		/* background: #FD9494; */
	}

	.container {
		/* position: absolute; */
		/*使用absolute的原因是因为为了防止第一个子视图有margin-top时，造成顶部留白的情况*/
		left: 0;
		top: 0;
		width: 100%;
	}


	.header-box {
		display: flex;
		padding: 15px 10px;
		justify-content: space-around;
		flex-direction: column;
		border-bottom: #929292 1px solid;
		background-color: #0072CE;
		color: whitesmoke;
	}

	.good {
		background-color: #66cc33;
	}

	.warning {
		background-color: #ffd500;
	}

	.disruption-circle {
		height: 30upx;
		width: 30upx;
		border-radius: 50%;
		display: inline-block;
		/* padding-left: 10upx; */
	}
</style>
