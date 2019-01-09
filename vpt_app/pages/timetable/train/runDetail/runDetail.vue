<template>
	<view class="content" style="flex: 1;flex-direction: column;">
		<view class="header-box">
			<view style="justify-content:space-between">
				<view>Belgrave Line</view>
				<view>Good Service</view>
			</view>
			<view style="justify-content:space-between">
				<view>Finders Street</view>
				<view>10:26PM</view>
			</view>
		</view>

<scroll-view scroll-y style="height: 1000upx;" class="uni-list">
		 <view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,index) in stops" :key="index" @tap="openStop"
		  :data-stopid="item.stopid">
		 	<view class="uni-list-cell-navigate uni-navigate-right" style="flex-direction: column;align-items: flex-start;">
		 		<view style="align-items:center">
		 			<text style="font-size:1em;padding-left:10upx;font-weight:bold;text-transform: uppercase;">{{item.stopName}}</text>
		 		</view>
		 		<view style="padding-top: 8upx;font-size: 33upx;font-weight: 700;color:#8F8F94">
		 			{{item.departureLocalTime}} - {{item.gapText}} travel time
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
				stops:[]
			};
		},
		onLoad:function(e){
			let runId = e.runId;
			let body = {
				routeType: '0',
				runId: runId
			}
			net.netUtil(con.STOP_URL, 'GET', body, ret => {
				if (ret) {
					this.stops = ret;
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
		height: 25upx;
		width: 25upx;
		border-radius: 50%;
		display: inline-block;
	}
</style>
