<template>
  <div class="app-container">
    <el-collapse-transition>
      <div class="form-p" v-if="formShow" ref="formPublic" v-resize="resize">
        <el-form :model="queryForm" ref="queryForm" :inline="true" label-width="70px">
          <el-form-item label="订单号" prop="orderno">
            <el-input
              v-model="queryForm.orderno"
              placeholder="请输入订单号"
              clearable
              size="small"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="店铺名称" prop="shopname">
            <el-input
              v-model="queryForm.shopname"
              placeholder="请输入店铺名称"
              clearable
              size="small"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item style="padding-left:11px">
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-collapse-transition>

    <div class="table-p" :style="{ 'min-height': minHeight }">
      <el-row :gutter="10" class="mb10 f-l">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-coin" size="mini" @click="handelPayAll">批量支付</el-button>
        </el-col>
        <el-col :span="1.5">
          <p class="checked-mount">
            勾选支付金额：
            <span>￥{{payamounts}}</span>
          </p>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="mb10 f-r icon-wrap">
        <el-col :span="1.5">
          <div class="icon-box icon-box-f" @click="formShow = !formShow">
            <i class="el-icon-zoom-in" v-show="!formShow"></i>
            <i class="el-icon-zoom-out" v-if="formShow"></i>
          </div>
        </el-col>
        <el-col :span="1.5">
          <div class="icon-box icon-box-t" @click="resetQuery">
            <i class="el-icon-refresh"></i>
          </div>
        </el-col>
      </el-row>
      <el-table
        style="width: 100%"
        v-loading="loading"
        :data="orderList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="订单号" prop="orderno" width="150" show-overflow-tooltip />
        <el-table-column label="创建时间" sortable prop="createtime" width="150" />
        <el-table-column label="订单金额" sortable prop="orderamount" width="130" />
        <el-table-column label="店铺名称" prop="shopname" show-overflow-tooltip />
        <el-table-column label="数量" prop="cmdtcount" width="60" />
        <el-table-column label="应收款" prop="needprice" width="70" />
        <el-table-column label="实收款" prop="realprice" width="70" />
        <el-table-column label="发货类型" prop="delivertype" width="70">
          <template slot-scope="scope">{{scope.row.delivertype | inDelivertype }}</template>
        </el-table-column>
        <el-table-column label="发票类型" prop="invocetype" width="70">
          <template slot-scope="scope">{{scope.row.invocetype | initInvocetype }}</template>
        </el-table-column>
        <el-table-column label="交易状态" prop="tradestate" width="120">
          <template slot-scope="scope">{{scope.row.tradestate | initTradestate}}</template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleDetail(scope.row)"
            >详情</el-button>
            <el-button size="mini" type="text" icon="el-icon-coin" @click="handlePey(scope.row)">去支付</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryForm.pageNum"
        :limit.sync="queryForm.pageSize"
        @pagination="getList"
      />
    </div>

    <el-dialog title="选择支付方式" :visible.sync="open" @close="clearValidate" width="470px">
      <el-form :model="payForm" ref="payForm" :rules="payFormRules" label-width="100px">
        <el-form-item label="支付方式：" prop="paymode" class="pay-radio">
          <el-radio-group v-model="payForm.paymode">
            <el-radio label="A">农行网银支付</el-radio>
            <el-radio label="6">银联跨行支付</el-radio>
            <el-radio label="7">农行对公账户支付</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">取 消</el-button>
        <el-button type="primary" :loading="loadingSend" @click="submitForm('payForm')">去支付</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getOrderList, handelToPay } from "@/api/order";
import minHeightMix from "@/mixins/minHeight";
import { accAdd } from "@/utils";
export default {
  mixins: [minHeightMix],
  data() {
    return {
      loading: false,
      loadingSend: false,
      open: false,
      formShow: true,
      activeName: "-1",
      orderList: [],
      total: 0,
      ordernos: [],
      payamounts: 0,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        tradestate: "0",
        orderno: undefined,
        shopname: undefined
      },
      payForm: {
        orderno: undefined,
        channelcode: "100001",
        paymode: undefined
      },
      payFormRules: {
        paymode: [
          { required: true, message: "请选择支付方式", trigger: "change" }
        ]
      }
    };
  },
  filters: {
    initTradestate(val) {
      const arr = [
        "待付款",
        "待发货",
        "已发货",
        "物流派件中",
        "已完成",
        "已关闭",
        "已失效",
        "待还款",
        "",
        "",
        "待称重",
        "已称重，待付款"
      ];
      return arr[val];
    },
    initPaystate(val) {
      const arr = ["支付未完成", "支付完成"];
      return arr[val];
    },
    initOrderstate(val) {
      if (val === "Y") {
        return "正常";
      } else if (val === "N") {
        return "删除";
      }
    },
    inDelivertype(val) {
      const arr = ["自提", "代发"];
      return arr[val];
    },
    initInvocetype(val) {
      const arr = ["不开发票", "开发票"];
      return arr[val];
    }
  },
  computed: {
    isCheckbox() {}
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      try {
        this.loading = true;
        const {
          code,
          data: {
            pageResult: { content, totalSize }
          }
        } = await getOrderList(this.queryForm);
        this.loading = false;
        if (code === 200) {
          this.orderList = content;
          this.total = totalSize;
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },
    handleQuery() {
      this.queryForm.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.createDateRange = [];
      this.payDateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleDetail(item) {
      this.$router.push({
        path: `/order/detail/${item.orderno}`
      });
    },
    resetPayForm() {
      Object.assign(this.payForm, {
        orderno: undefined,
        channelcode: "100001",
        paymode: undefined
      });
    },
    clearValidate() {
      this.$refs.payForm.resetFields();
    },
    handlePey(item) {
      this.resetPayForm();
      Object.assign(this.payForm, {
        orderno: item.orderno
      });
      this.open = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            this.loadingSend = true;
            const {
              code,
              data: {
                code: code2,
                payInfo: { PaymentURL }
              }
            } = await handelToPay(this.payForm);
            this.loadingSend = false;
            if (code === 200 && code2 === "0000") {
              this.open = false;
              window.open(PaymentURL, "_self");
            }
          } catch (err) {
            this.loadingSend = false;
            console.log(err);
          }
        } else {
          return false;
        }
      });
    },
    handleSelectionChange(selection) {
      this.ordernos = selection.map(item => {
        return item.orderno;
      });
      this.payamounts = selection.reduce((pre, item) => {
        pre = accAdd(pre, Number(item.needprice));
        return pre;
      }, 0);
    },
    handelPayAll() {
      if (this.ordernos.length > 0) {
        this.resetPayForm();
        Object.assign(this.payForm, {
          orderno: this.ordernos.join(",")
        });
        this.open = true;
      } else {
        this.$confirm("至少选择一个订单支付！", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          customClass: "el-message-box-wran"
        })
          .then(() => {})
          .catch(() => {});
      }
    }
  }
};
</script>