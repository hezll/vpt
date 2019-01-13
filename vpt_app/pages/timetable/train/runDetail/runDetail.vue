<template>
	<view class="content" style="flex: 1;flex-direction: column;width:100%;">
		<view>
			<uni-notice-bar show-icon="true" text="Buses replace trains from Parliament">
			</uni-notice-bar>
		</view>
		<view class="header-box">
			<view style="justify-content:space-between">
				<view>{{line}} Line</view>
				<view style="align-items: center;">
					<text style="padding-right: 10upx;">Good Service</text>
					<view class="disruption-circle good"></view>
				</view>
			</view>
			<view style="justify-content:space-between;font-size:1em;font-weight:bold;text-transform: uppercase;">
				<view>{{terminal}}</view>
				<view>{{departTime}}</view>
			</view>
		</view>

		<scroll-view scroll-y style="height: 1000upx;" class="uni-list">
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,index) in stops" :key="index" @tap="openStop"
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
		</scroll-view>

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
					let selectedDepartureUTCTime = ret.filter(stop => stop.stopId == stopId)[0].departureUTCTime
					this.stops = ret.filter(stop => {
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

		},
		methods: {

		}
	}
</script>

<style>
	
	
	.header-box {
		display: flex;
		padding: 15px 10px;
		justify-content: space-around;
		flex-direction: column;
		border-bottom: #929292 1px solid;
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
