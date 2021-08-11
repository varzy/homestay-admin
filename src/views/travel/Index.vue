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
      :title="dialogType === 'CREATE' ? '添加旅途' : '编辑旅途'"
      @closed="handleDialogClosed"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="formRules"
        label-width="72px"
        :disabled="isDialogSubmitting"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="form.price" placeholder="请输入价格"></el-input>
        </el-form-item>
        <el-form-item label="封面图" prop="cover">
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
import { reqFetchTrips, reqCreateTrip, reqUpdateTrip } from '@/api/trips';

export default {
  name: 'Travel',

  data() {
    return {
      isDialogVisible: false,
      isTableLoading: false,
      isDialogSubmitting: false,
      dialogType: '',
      tableData: [],
      pagination: { page: 1, size: 15, total: 0 },
      form: {
        id: 0,
        title: '',
        price: '',
        cover: '',
      },
      formRules: {
        title: [
          { required: true, message: '请填写标题', trigger: 'blur' },
          { max: 64, message: '标题最长 64 个字符', trigger: 'blur' },
        ],
        price: [
          { required: true, message: '请填写价格', trigger: 'blur' },
          {
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            message: '价格必须是一个最多两位小数的正数',
            trigger: 'blur',
          },
        ],
        cover: [
          { required: true, message: '请填写封面图地址', trigger: 'blur' },
          {
            pattern: /^(http(s)?:\/\/)\w+[^\s]+(\.[^\s]+){1,}$/,
            message: '封面图地址必须是一个标准的 URL',
            trigger: 'blur',
          },
        ],
      },
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
    onEdit({ row }) {
      this.dialogType = 'EDIT';
      this.isDialogVisible = true;
      // 不应该这么写！保证你所有的数据都和 data 中定义的结构完全一致，保证可控
      // 而且会导致对象的引用，如果更改子组件，父组件的值也会一起改变
      // this.form = row;
      this.form.id = row.id;
      this.form.title = row.title;
      this.form.price = row.price / 100;
      this.form.cover = row.cover;
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
    handleDialogClosed() {
      this.$refs.form.resetFields();
      // 假如标单项没有被重置，那么还是可以在弹窗关闭后进行重置
      // this.form.title = '';
    },
    async onDialogSubmit() {
      try {
        await this.$refs.form.validate();
      } catch {
        this.$message.warning('请完善全部表单项');
        return;
      }

      try {
        this.isDialogSubmitting = true;

        const reqData = {
          title: this.form.title,
          cover: this.form.cover,
          price: Number(this.form.price) * 100,
        };
        if (this.dialogType === 'CREATE') {
          await reqCreateTrip(reqData);
        } else {
          await reqUpdateTrip(this.form.id, reqData);
        }

        this.isDialogVisible = false;
        this.getTravel();
        this.$message.success(this.dialogType === 'CREATE' ? '添加成功' : '编辑成功');
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
