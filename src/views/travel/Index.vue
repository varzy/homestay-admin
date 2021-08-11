<template>
  <div class="travel">
    <el-card>
      <el-button type="primary" @click="onCreate">添加旅途</el-button>

      <el-table class="table" :data="tableData">
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column label="ID" prop="id"></el-table-column>
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
    </el-card>

    <el-dialog
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
      isDialogSubmitting: false,
      tableData: [],
      form: {
        title: '',
        price: '',
        cover: '',
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
      const res = await reqFetchTrips();
      this.tableData = res.data;
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
  .table {
    margin-top: 16px;
  }
}
</style>
