<template>
  <div class="travel">
    <el-card>
      <el-button type="primary" @click="onCreate">添加旅途</el-button>

      <el-table size="mini" class="g-gap" :data="tableData" v-loading="isTableLoading">
        <el-table-column label="#" type="index"  :index="calcTableIndex"></el-table-column>
        <el-table-column label="ID" prop="id" width="96px"></el-table-column>
        <el-table-column label="封面图" width="108px">
          <template slot-scope="scope">
            <img class="cover" :src="scope.row.cover" :alt="scope.row.title">
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="价格">
          <template slot-scope="scope"> {{ scope.row.price / 100 }} 元 </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button plain type="primary" size="mini" @click="onEdit(scope)">编辑</el-button>
            <el-button plain type="danger" size="mini" @click="onDelete(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
      class="g-gap-s"
        :hide-on-single-page="pagination.total <= pagination.size"
        background
        layout="total, prev, pager, next"
        :total="pagination.total"
        :current-page="pagination.page"
        :page-size="pagination.size"
        @current-change="handlePageChanged"
      >
      </el-pagination>
    </el-card>

    <el-dialog
      small
      :page-size="pagination.size"
      :current-page="pagination.page"
      :visible.sync="isDialogVisible"
      width="640px"
      :close-on-click-modal="false"
      title="添加旅程"
    >
      <el-form label-width="72px" :disabled="isDialogSubmitting">
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="form.price" placeholder="请输入价格"></el-input>
        </el-form-item>
        <el-form-item label="封面图">
          <el-input v-model="form.cover" placeholder="请输入封面图"></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="onDialogCancel">取消</el-button>
        <el-button type="primary" :loading="isDialogSubmitting" @click="onDialogSubmit"
          >确定</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reqFetchTrips, reqCreateTrip } from '@/api/trips';

export default {
  name: 'Travel',

  data() {
    return {
      isDialogVisible: false,
      isTableLoading: false,
      isDialogSubmitting: false,
      tableData: [],
      form: {
        title: '',
        price: '',
        cover: '',
      },
      pagination: { page: 1, size: 15, total: 0 },
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
      this.isDialogVisible = true;
    },
    onEdit({ row }) {
      console.log(row);
    },
    onDelete({ row }) {
      console.log(row);
    },
    handlePageChanged(current) {
      this.pagination.page = current;
      this.getTravel();
    },
    // ==================================
    // Dialog
    // ==================================
    onDialogCancel() {
      this.isDialogVisible = false;
    },
    async onDialogSubmit() {
      try {
        this.isDialogSubmitting = true;

        await reqCreateTrip({
          title: this.form.title,
          cover: this.form.cover,
          price: Number(this.form.price),
        });

        this.isDialogVisible = false;
        this.getTravel();
      } finally {
        this.isDialogSubmitting = false;
      }
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
