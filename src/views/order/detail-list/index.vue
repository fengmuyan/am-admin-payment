<template>
  <div class="app-container">
    <el-collapse-transition>
      <div class="form-p" v-if="formShow" ref="formPublic" v-resize="resize">
        <el-form :model="queryForm" ref="queryForm" :inline="true" label-width="80px">
          <el-form-item label="查询时间">
            <el-date-picker
              v-model="dateRange"
              size="small"
              :clearable="false"
              style="width: 360px"
              type="datetimerange"
              :picker-options="pickerOptions"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-collapse-transition>

    <div class="table-p" :style="{ 'min-height': minHeight }">
      <el-row :gutter="10" class="mb10 f-r icon-wrap">
        <el-col :span="1.5">
          <div class="icon-box icon-box-f" @click="formShow = !formShow">
            <i class="el-icon-zoom-in" v-show="!formShow"></i>
            <i class="el-icon-zoom-out" v-if="formShow"></i>
          </div>
        </el-col>
        <el-col :span="1.5">
          <div class="icon-box icon-box-t" @click="handleQuery">
            <i class="el-icon-refresh"></i>
          </div>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-download"
            size="mini"
            :loading="exportLoading"
            @click="handleExport"
            style="margin-left:10px"
          >导出数据</el-button>
        </el-col>
      </el-row>
      <el-table style="width: 100%" v-loading="loading" :data="orderList">
        <el-table-column label="订单号" prop="orderno" width="150" show-overflow-tooltip />
        <el-table-column label="商品名称" prop="title" width="150" show-overflow-tooltip />
        <el-table-column label="供应商" prop="shopname" />
        <el-table-column label="产地" prop="area" />
        <el-table-column label="商标" prop="trademark" />
        <el-table-column label="品种" prop="varieties" />
        <el-table-column label="级别" prop="level" />
        <el-table-column label="单价" prop="unitDiscountPrice" />
        <el-table-column label="净重" prop="netweight" />
        <el-table-column label="毛重" prop="grossweight" />
        <el-table-column label="总净重" prop="totalnetweight" />
        <el-table-column label="总毛重" prop="totalgrossweight" />
        <el-table-column label="数量" prop="cmdtcount" />
        <el-table-column label="商品金额" prop="cmdttotalprice" />
        <el-table-column label="优惠金额" prop="zyhprice" />
        <el-table-column label="需支付" prop="xzfprice" />
        <el-table-column label="已支付" prop="payamount" />
        <el-table-column label="是否付清" prop="sfyfk" />
        <el-table-column label="最后付款" prop="finalpaytime" width="150" />
      </el-table>
      <div class="total-wrap">
        <div class="total-data">
          <i>
            订单数：
            <span>{{ordercount}}</span>
          </i>
          <i>
            商品数：
            <span>{{cmdtcount}}</span>
          </i>
          <i>
            已支付金额：
            <span>￥{{payamout}}</span>
          </i>
          <i>
            未还金额：
            <span>￥{{notpay}}</span>
          </i>
        </div>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryForm.pageNum"
          :limit.sync="queryForm.pageSize"
          @pagination="getList"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { getDetailList, handelExportDetail } from "@/api/order";
import minHeightMix from "@/mixins/minHeight";
export default {
  mixins: [minHeightMix],
  data() {
    return {
      loading: false,
      exportLoading: false,
      formShow: true,
      orderList: [],
      total: 0,
      dateRange: [],
      cmdtcount: 0,
      notpay: 0,
      ordercount: 0,
      payamout: 0,
      queryForm: {
        pageNum: 1,
        pageSize: 10
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  created() {
    this.resetTime();
    this.getList();
  },
  methods: {
    async getList() {
      try {
        this.loading = true;
        const { _initParams, queryForm } = this;
        const {
          code,
          data: {
            pageResult: { content, totalSize },
            cmdtcount,
            notpay,
            ordercount,
            payamout
          }
        } = await getDetailList(_initParams(queryForm));
        this.loading = false;
        if (code === 200) {
          this.orderList = content;
          this.total = totalSize;
          this.cmdtcount = cmdtcount;
          this.notpay = notpay;
          this.ordercount = ordercount;
          this.payamout = payamout;
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },
    resetTime() {
      this.dateRange = [
        `${this.parseTime(
          new Date().getTime() - 3600 * 1000 * 24 * 30,
          "{y}-{m}-{d} {h}:{i}:{s}"
        )}`,
        `${this.parseTime(new Date().getTime(), "{y}-{m}-{d} {h}:{i}:{s}")}`
      ];
    },
    handleQuery() {
      this.queryForm.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.resetTime();
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleExport() {
      const { _initParams, queryForm } = this;
      this.$confirm("是否确认导出所有数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "el-message-box-wran"
      })
        .then(async () => {
          this.exportLoading = true;
          const { msg, code } = await handelExportDetail(
            _initParams(queryForm)
          );
          if (code === 200) {
            this.download(msg);
            this.msgSuccess("导出成功");
            this.exportLoading = false;
          } else {
            this.exportLoading = false;
          }
        })
        .catch(function() {});
    },
    _initParams(obj) {
      const dateRange = this.dateRange || [];
      Object.assign(obj, {
        createtimestart: dateRange.length > 0 ? dateRange[0] : null,
        createtimeend: dateRange.length > 0 ? dateRange[1] : null
      });
      return obj;
    }
  }
};
</script>