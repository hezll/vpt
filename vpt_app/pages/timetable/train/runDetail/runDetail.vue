<template>
	<view class="content" style="flex: 1;flex-direction: column;width:100%;">
		<view class="header-box">
			<view style="justify-content:space-between;font-size:16px;">
				<view>{{line}} Line</view>
				<view>{{departTime}}</view>
			</view>
			<view style="justify-content:space-between;font-size:1.1em;font-weight:bold;">
				<view>{{terminal}}</view>
				<view style="align-items: center;" @tap="getMore">
					<text style="padding-right: 12upx;">{{status}}</text>
					<view class="wave solid warning">
						<view class="circle"></view>
						<faicon type="volume-up" :color="statusColor" size="16"></faicon>
					</view>
				</view>
			</view>
		</view>
		<view class="notice-bar" v-show=showNotice>
			<view class="uni-list-cell" v-for="(item,index) in descriptions" :key="index">
				<uni-notice-bar show-icon="true" :text="item">
				</uni-notice-bar>
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
				statusColor: '',
				descriptions: [],
				showNotice: true,
			};
		},

		onLoad: function(e) {
			this.terminal = e.terminal;
			this.line = e.line;
			this.departTime = e.departTime;
			this.statusColor = e.statusColor;
			console.info("status color:" + this.statusColor);
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
					this.scrollHeight = "height:" + (res.windowHeight - 81) + "px";
				}
			})
		},
		methods: {
			getMore: function() {
				this.showNotice = !this.showNotice;
			}
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

	 .disruption-circle {
		height: 35upx;
		width: 35upx;
		border-radius: 50%;
		display: inline-block;
	} 

	.notice-bar {
		flex-direction: column;
		background-color: #fffbe8;
		position: absolute;
		top: 81px;
		width: 100%;
		z-index: 1;
	}
	
	.wave {
			position: relative;
		   width: 55upx;
		    height: 55upx;
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
		}
 
		.wave .circle {
		    position: absolute;
		    border-radius: 50%;
		    opacity: 0;
		}
 
		
 
		/* 波动效果 */
		.wave.solid .circle{
			width: 100%;
    		height: 100%;
		    background: #fff;
		}
 
		.wave.solid .circle:first-child {
			animation: circle-opacity 2s infinite;
		}
 
		/* .wave.solid.danger {
			color: red;
		}
 
		.wave.solid.danger .circle{
			background: red;
		} */
		
		.wave.solid.warning {
			color: #66cc33;
		}
 
		.wave.solid.warning .circle{
			background: #66cc33;
		}
 
		@keyframes circle-opacity{
		    from {
		        opacity: 1;
		        transform: scale(0);
		    }
		    to {
		        opacity: 0;
		        transform: scale(1);
		    }
		}
</style>
