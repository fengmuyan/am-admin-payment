<template>
  <div class="order-detail-wrap app-container">
    <div class="order-detail" v-loading="loading" v-if="goodsList">
      <div class="statusStep">
        <div class="statusLeft">
          <p>订单号：{{orderno}}</p>
          <h3>{{tradestate | initTradestate}}</h3>
        </div>
        <ul class="statusRight">
          <li>
            <div class="imgIcon"></div>
            <p class="iconTitle active">买家下单</p>
            <p class="date">{{createtime}}</p>
          </li>
          <ul class="f-l" v-if="!ac5 && !ac6">
            <li class="line" v-if="ordertype===1">
              <div class="imgLine"></div>
            </li>
            <li v-if="ordertype===1">
              <div :class="['imgIcon', 'imgIcon1',ac12411?'imgIcon1-ac':'']"></div>
              <p :class="['iconTitle',ac12411?'active':'']">商家称重</p>
              <p class="date" v-if="ac12411">{{weighttime}}</p>
            </li>
            <li class="line">
              <div class="imgLine gryLine"></div>
            </li>
            <li>
              <div :class="['imgIcon', 'imgIcon2',ac124?'imgIcon2-ac':'']"></div>
              <p :class="['iconTitle',ac124?'active':'']">买家付款</p>
              <p class="date" v-if="ac124">{{paytime}}</p>
            </li>
            <li class="line">
              <div class="imgLine gryLine"></div>
            </li>
            <li>
              <div :class="['imgIcon', 'imgIcon3',ac24?'imgIcon3-ac':'']"></div>
              <p :class="['iconTitle',ac24?'active':'']">商家发货</p>
              <p class="date" v-if="ac24">{{deliverytime}}</p>
            </li>
            <li class="line">
              <div class="imgLine gryLine"></div>
            </li>
            <li class="lang-item">
              <div :class="['imgIcon', 'imgIcon4',ac4?'imgIcon4-ac':'']"></div>
              <p :class="['iconTitle',ac4?'active':'']">买家确认收货</p>
              <p class="date" v-if="ac4">{{receivetime}}</p>
            </li>
            <li class="line">
              <div class="imgLine gryLine"></div>
            </li>
            <li>
              <div :class="['imgIcon', 'imgIcon5',ac4?'imgIcon5-ac':'']"></div>
              <p :class="['iconTitle',ac4?'active':'']">完成</p>
              <p class="date" v-if="ac4">{{finaltime}}</p>
            </li>
          </ul>
          <ul class="f-l" v-if="ac5">
            <li class="line" v-if="ordertype===1 && weighttime">
              <div class="imgLine"></div>
            </li>
            <li v-if="ordertype===1 && weighttime">
              <div class="imgIcon imgIcon1 imgIcon1-ac"></div>
              <p class="iconTitle active">商家称重</p>
              <p class="date">{{weighttime}}</p>
            </li>
            <li class="line">
              <div class="imgLine gryLine"></div>
            </li>
            <li>
              <div class="imgIcon imgIcon6-ac"></div>
              <p class="iconTitle active">已关闭</p>
              <p class="date">{{finaltime}}</p>
            </li>
          </ul>
          <ul class="f-l" v-if="ac6">
            <li class="line" v-if="ordertype===1 && weighttime">
              <div class="imgLine"></div>
            </li>
            <li v-if="ordertype===1 && weighttime">
              <div class="imgIcon imgIcon1 imgIcon1-ac"></div>
              <p class="iconTitle active">商家称重</p>
              <p class="date">{{weighttime}}</p>
            </li>
            <li class="line">
              <div class="imgLine gryLine"></div>
            </li>
            <li>
              <div class="imgIcon imgIcon7-ac"></div>
              <p class="iconTitle active">已失效</p>
              <p class="date">{{failuretime}}</p>
            </li>
          </ul>
        </ul>
      </div>
      <div class="goodsList">
        <el-table :data="goodsList" class="goodsTable">
          <el-table-column label="商品信息" width="485">
            <template slot-scope="scope">
              <div class="imgBox">
                <img :src="scope.row.image" alt />
              </div>
              <div class="content">
                <h4>{{scope.row.title}}</h4>
                <p>
                  <span class="agent-pro" v-if="scope.row.isagent==='Y'">代卖商品，</span>
                  {{scope.row.standards.substring(0,scope.row.standards.length-1)}}。
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="价格/件" prop="cmdtprice" />
          <el-table-column label="数量" prop="cmdtcount" />
          <el-table-column label="折扣" prop="discount">
            <template slot-scope="scope">{{scope.row.discount | initDiscount}}</template>
          </el-table-column>
          <el-table-column label="优惠" prop="couponprice" />
          <el-table-column label="抹零" prop="dispelprice" />
          <el-table-column label="抹账" prop="wipeaccountsprice">
            <template slot-scope="scope">
              <el-popover placement="top-start" title="抹账" width="220" trigger="hover">
                <div>
                  <p style="margin:0;line-height:22px">已还：{{scope.row.payamount}}</p>
                  <p style="margin:0;line-height:22px">备注：{{scope.row.remarks}}</p>
                </div>
                <span slot="reference">{{scope.row.wipeaccountsprice}}</span>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="总价" prop="cmdttotalprice" />
          <el-table-column label="状态" width="120px">
            <template slot-scope="scope">
              <span>{{scope.row.tradestate | initTradestate}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="goodsFooter">
          <div class="footer-right">
            <p>
              <b class="totalGoods">
                共
                <span>{{totalNum}}</span>件商品
              </b>
              <b>商品总价：</b>
              <span>￥{{orderamount}}</span>
            </p>
            <p>
              <b>总优惠价格：</b>
              <span>￥{{totalAdjustPrice}}</span>
            </p>
            <p>
              <b>总抹零价格：</b>
              <span>￥{{totalWeightPrice}}</span>
            </p>
            <p>
              <b>总抹账金额：</b>
              <span>￥{{totalWipePrice}}</span>
            </p>
            <p>
              <b>运费（快递）：</b>
              <span>￥{{carriage}}</span>
            </p>
            <p>
              <b>应付总价：</b>
              <span>￥{{needprice}}</span>
            </p>
            <p>
              <b>已支付：</b>
              <span>￥{{ac1234?needprice:0}}</span>
            </p>
            <p class="total">
              <b>资金付款：</b>
              <span>￥{{realprice}}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="footer-left" v-if="delivertype !==0">
          <h4>收货人信息</h4>
          <p>
            <b>收货人：</b>
            <span>{{deliveryAddress.name}}</span>
          </p>
          <p>
            <b>联系方式：</b>
            <span>{{deliveryAddress.phone}}</span>
          </p>
          <p>
            <b>收货地址：</b>
            <span>{{deliveryAddress.province}}{{deliveryAddress.city}}{{deliveryAddress.area}}{{deliveryAddress.address}}</span>
          </p>
        </div>
        <div class="footer-left" style="border:none" v-if="invocetype !==0">
          <h4>发票信息</h4>
          <p>
            <b>发票抬头：</b>
            <span>{{Number(invoceInfo.owner === 1)?invoceInfo.name:invoceInfo.company}}</span>
          </p>
          <p>
            <b>发票类型：</b>
            <span>{{invoceInfo.type | initInvoce}}</span>
          </p>
          <p>
            <b>发票税号：</b>
            <span>{{invoceInfo.taxno}}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getOrderDetail } from "@/api/order";
import { accAdd } from "@/utils";
export default {
  name: "orderDetail",
  data() {
    return {
      openWeight: false,
      loading: false,
      goodsList: null,
      tradestate: "",
      totalNum: "",
      totalPrice: "",
      orderno: "",
      carriage: "",
      needprice: "",
      realprice: "",
      ordertype: "",
      invocetype: "",
      delivertype: "",
      deliveryAddress: null,
      invoceInfo: null,
      createtime: "",
      weighttime: "",
      paytime: "",
      deliverytime: "",
      receivetime: "",
      finaltime: "",
      failuretime: "",
      orderamount: 0,
      totalAdjustPrice: 0,
      totalWeightPrice: 0,
      totalWipePrice: 0
    };
  },
  filters: {
    initTradestate(val) {
      const arr = [
        "待付款",
        "待发货",
        "待确认收货",
        "物流派件中",
        "已完成",
        "已关闭",
        "已失效",
        "",
        "",
        "",
        "待称重",
        "已称重，待付款"
      ];
      return arr[val];
    },
    initInvoce(type) {
      const arr = ["", "普通发票", "增值税发票"];
      return arr[type];
    },
    initDiscount(val) {
      if (!val) return "";
      if (val === 1) {
        return "无折扣";
      } else {
        return `${Number(val) * 100}折`;
      }
    }
  },
  computed: {
    ac12411() {
      const tradestate = this.tradestate;
      return (
        tradestate === 11 ||
        tradestate === 1 ||
        tradestate === 2 ||
        tradestate === 4
      );
    },
    ac124() {
      const tradestate = this.tradestate;
      return tradestate === 1 || tradestate === 2 || tradestate === 4;
    },
    ac24() {
      const tradestate = this.tradestate;
      return tradestate === 2 || tradestate === 4;
    },
    ac4() {
      return this.tradestate === 4;
    },
    ac5() {
      return this.tradestate === 5;
    },
    ac6() {
      return this.tradestate === 6;
    },
    ac23() {
      return this.tradestate === 2 || this.tradestate === 3;
    },
    ac1234() {
      const tradestate = this.tradestate;
      return (
        tradestate === 1 ||
        tradestate === 2 ||
        tradestate === 3 ||
        tradestate === 4
      );
    }
  },
  created() {
    this.orderno = this.$route.params.code;
    this.getDetail();
  },
  methods: {
    async getDetail() {
      try {
        this.loading = true;
        const {
          code,
          data: {
            tradestate,
            cmdtOrderDetailRespList,
            carriage,
            needprice,
            realprice,
            ordertype,
            invocetype,
            delivertype,
            orderDeliveryAddressResp: deliveryAddress,
            orderInvoceResp: invoceInfo,
            createtime,
            paytime,
            deliverytime,
            weighttime,
            receivetime,
            finaltime,
            failuretime,
            orderamount
          }
        } = await getOrderDetail({
          orderno: this.orderno
        });
        this.loading = false;
        if (code === 200) {
          this.goodsList = cmdtOrderDetailRespList;
          this.tradestate = Number(tradestate);
          this.carriage = carriage;
          this.needprice = needprice;
          this.realprice = realprice;
          this.ordertype = Number(ordertype);
          this.invocetype = Number(invocetype);
          this.delivertype = Number(delivertype);
          this.deliveryAddress = deliveryAddress;
          this.invoceInfo = invoceInfo;
          this.createtime = createtime;
          this.paytime = paytime;
          this.deliverytime = deliverytime;
          this.weighttime = weighttime;
          this.receivetime = receivetime;
          this.finaltime = finaltime;
          this.failuretime = failuretime;
          this.orderamount = orderamount;
          this.totalNum = cmdtOrderDetailRespList.reduce((pre, item) => {
            pre += Number(item.cmdtcount);
            return pre;
          }, 0);

          this.totalAdjustPrice = cmdtOrderDetailRespList.reduce(
            (pre, item) => {
              pre = accAdd(pre, Number(item.couponprice));
              return pre;
            },
            0
          );

          this.totalWeightPrice = cmdtOrderDetailRespList.reduce(
            (pre, item) => {
              pre = accAdd(pre, Number(item.dispelprice));
              return pre;
            },
            0
          );

          this.totalWipePrice = cmdtOrderDetailRespList.reduce((pre, item) => {
            pre = accAdd(pre, Number(item.wipeaccountsprice));
            return pre;
          }, 0);

          cmdtOrderDetailRespList.forEach(item => {
            Object.assign(item, {
              standards: JSON.parse(item.saleprovalue).salepro.reduce(
                (pre, v) => {
                  if (typeof v.values === "object") {
                    pre += `${v.name}：${v.values.value}，`;
                  } else if (typeof v.values === "string") {
                    pre += `${v.name}：${v.values}，`;
                  }
                  return pre;
                },
                ""
              )
            });
          });
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    }
  }
};
</script>