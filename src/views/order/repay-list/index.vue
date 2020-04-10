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
          <el-button type="primary" icon="el-icon-coin" size="mini" @click="handleRepeyAll">批量还款</el-button>
        </el-col>
        <el-col :span="1.5">
          <p class="checked-mount">勾选还款金额：<span>￥{{repayamounts}}</span></p>
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
        <el-table-column label="未还金额" prop="debt" width="70" />
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
            <el-button
              size="mini"
              type="text"
              icon="el-icon-bank-card"
              v-if="Number(scope.row.restate) === 7"
              @click="handleRepey(scope.row)"
            >去还款</el-button>
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

    <el-dialog title="还款操作" :visible.sync="openRepay" @close="clearValidateRepay" width="470px">
      <el-form :model="repayForm" ref="repayForm" :rules="repayFormRules" label-width="100px">
        <el-form-item label="支付方式：" prop="paymode" class="pay-radio">
          <el-radio-group v-model="repayForm.paymode">
            <el-radio label="A">农行网银支付</el-radio>
            <el-radio label="6">银联跨行支付</el-radio>
            <el-radio label="7">农行对公账户支付</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="还款金额：" prop="repayamount">
          <el-input
            v-model="repayForm.repayamount"
            placeholder="请输入还款金额"
            :disabled="ordernos.length>1 && orderLock === true"
            clearable
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openRepay = false">取 消</el-button>
        <el-button type="primary" :loading="loadingRepay" @click="submitRepayForm('repayForm')">去还款</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getOrderList, handelToPay, handelToRepay } from "@/api/order";
import { accAdd } from "@/utils";
import minHeightMix from "@/mixins/minHeight";
export default {
  mixins: [minHeightMix],
  data() {
    const patter = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
    const validateAmount = (rule, value, callback) => {
      if (!patter.test(value)) {
        callback(new Error("必须非负整数或至多保留两位小数！"));
      } else if (Number(value) > Number(this.repayForm.debt)) {
        callback(
          new Error(`还款金额不能大于待还金额（${this.repayForm.debt}）！`)
        );
      } else if (Number(value) < 0.01) {
        callback(new Error(`还款金额不能小于0.01！`));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      loadingRepay: false,
      open: false,
      openRepay: false,
      formShow: true,
      activeName: "-1",
      orderList: [],
      total: 0,
      ordernos: [],
      repayamounts: 0,
      orderLock: false,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        tradestate: "7",
        orderno: undefined,
        shopname: undefined
      },
      repayForm: {
        orderno: undefined,
        channelcode: "100001",
        paymode: undefined,
        repayamount: undefined,
        debt: undefined
      },
      repayFormRules: {
        paymode: [
          { required: true, message: "请选择支付方式", trigger: "change" }
        ],
        repayamount: [
          { required: true, message: "请输入还款金额", trigger: "blur" },
          { validator: validateAmount, trigger: ["change", "blur"] }
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
    resetRePayForm() {
      Object.assign(this.repayForm, {
        orderno: undefined,
        channelcode: "100001",
        paymode: undefined,
        repayamount: undefined,
        debt: undefined
      });
    },
    clearValidateRepay() {
      this.$refs.repayForm.resetFields();
    },
    handleRepey(item) {
      this.orderLock = false;
      this.resetRePayForm();
      Object.assign(this.repayForm, {
        orderno: item.orderno,
        repayamount: item.debt,
        debt: item.debt
      });
      this.openRepay = true;
    },
    submitRepayForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            this.loadingRepay = true;
            const {
              code,
              data: {
                code: code2,
                payInfo: { PaymentURL }
              }
            } = await handelToRepay(this.repayForm);
            this.loadingRepay = false;
            if (code === 200 && code2 === "0000") {
              this.openRepay = false;
              window.open(PaymentURL, "_self");
            }
          } catch (err) {
            this.loadingRepay = false;
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
      this.repayamounts = selection.reduce((pre, item) => {
        pre = accAdd(pre, Number(item.debt));
        return pre;
      }, 0);
    },
    handleRepeyAll() {
      if (this.ordernos.length > 0) {
        this.orderLock = true;
        this.resetRePayForm();
        Object.assign(this.repayForm, {
          orderno: this.ordernos.join(","),
          repayamount: this.repayamounts
        });
        this.openRepay = true;
      } else {
        this.$confirm("至少选择一个订单还款！", "警告", {
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