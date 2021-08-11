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
  </div>
</template>

<script>
// import axios from 'axios';
import { reqFetchTrips } from '@/api/trips';

export default {
  name: 'Travel',

  data() {
    return {
      tableData: [],
    };
  },

  created() {
    this.getTravel();
  },

  methods: {
    async getTravel() {
      const res = await reqFetchTrips();
      this.tableData = res.data;
    },
    onCreate() {},
    onEdit({ row }) {
      console.log(row);
    },
    onDelete({ row }) {
      console.log(row);
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
