<template>
  <div class="travel">
    <el-card>
      <el-button type="primary" @click="onCreate">添加旅途</el-button>

      <el-table size="mini" class="g-gap" :data="tableData" v-loading="isTableLoading">
        <el-table-column label="#" type="index" :index="calcTableIndex"></el-table-column>
        <el-table-column label="ID" prop="id" width="96px"></el-table-column>
        <el-table-column label="封面图" width="108px">
          <template slot-scope="scope">
            <img class="cover" :src="scope.row.cover" :alt="scope.row.title" />
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="价格">
          <template slot-scope="scope"> {{ scope.row.price / 100 }} 元 </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button plain type="primary" size="mini" @click="onEdit(scope)">编辑</el-button>
            <el-popconfirm title="确定删除吗？" @confirm="onDelete(scope)">
              <el-button slot="reference" plain type="danger" size="mini" style="margin-left: 8px"
                >删除</el-button
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="g-gap-s"
        background
        layout="total,sizes, prev, pager, next"
        :total="pagination.total"
        :current-page="pagination.page"
        :page-size="pagination.size"
        :page-sizes="[startupPageSize, 30, 50, 100]"
        @current-change="handlePageChanged"
        @size-change="handleSizeChanged"
      >
      </el-pagination>
    </el-card>

    <travel-creator-and-editor
      :is-visible.sync="isDialogVisible"
      :dialog-type="dialogType"
      :travel-id="editingTravelId"
      @submit="handleTravelCreatorAndEditorSubmiited"
    ></travel-creator-and-editor>
  </div>
</template>

<script>
/**
 * @Questions
 * 1. Q: 假如列表页接口没有给你返回全部数据，比如 price，但是编辑时需要编辑 price，怎么做？
 *    H: 点击编辑的时候，先请求详情接口
 * 2. Q: 假如删除了某一页的最后一条数据，分页做什么样的行为？比如删除第 4 页最后一条数据，应该到第三页
 * 3. Q: 分页支持改变每页条数，即 pagination.size 支持变化
 * 4. Q: 当前组件代码量已经很大了，但实际上表格逻辑和弹窗逻辑关联并不大，能否拆成两个独立的组件？
 */

import { reqFetchTrips, reqDestroyTrip } from '@/api/trips';
import TravelCreatorAndEditor from './TravelCreatorAndEditor';

export default {
  name: 'Travel',

  components: { TravelCreatorAndEditor },

  data() {
    const startupPageSize = 15;

    return {
      isTableLoading: false,
      isDialogVisible: false,
      editingTravelId: 0,
      dialogType: '',
      tableData: [],
      startupPageSize,
      pagination: { page: 1, size: startupPageSize, total: 0 },
    };
  },

  created() {
    this.getTravel();
  },

  methods: {
    // ==================================
    // Table
    // ==================================
    async getTravel() {
      try {
        this.isTableLoading = true;

        const res = await reqFetchTrips({ page: this.pagination.page, size: this.pagination.size });
        this.tableData = res.data.list;
        this.pagination.total = res.data.total;
      } finally {
        this.isTableLoading = false;
      }
    },
    calcTableIndex(index) {
      return (this.pagination.page - 1) * this.pagination.size + index + 1;
    },
    onCreate() {
      this.dialogType = 'CREATE';
      this.isDialogVisible = true;
    },
    async onEdit({ row }) {
      this.dialogType = 'EDIT';
      this.editingTravelId = row.id;
      this.isDialogVisible = true;
    },
    async onDelete({ row }) {
      try {
        this.isTableLoading = true;
        await reqDestroyTrip(row.id);
        this.$message.success('删除成功');

        if (this.tableData.length === 1) {
          this.pagination.page -= 1;
        }

        this.getTravel();
      } finally {
        this.isTableLoading = false;
      }
    },
    handlePageChanged(current) {
      this.pagination.page = current;
      this.getTravel();
    },
    handleSizeChanged(size) {
      this.pagination.size = size;
      this.getTravel();
    },
    // ==================================
    // Dialog
    // ==================================
    handleTravelCreatorAndEditorSubmiited() {
      this.getTravel();
    },
  },
};
</script>

<style scoped lang="scss">
.travel {
  .cover {
    width: 100%;
    height: 72px;
    // 保证图片比例进行裁切
    object-fit: cover;
    border-radius: 4px;
  }
}
</style>
